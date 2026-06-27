package tum.devoops.organizationservice.service;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import tum.devoops.organizationservice.repository.DirectorRepository;
import tum.devoops.organizationservice.repository.TraineeRepository;
import tum.devoops.organizationservice.repository.TrainerRepository;

/**
 * Keeps each member's Keycloak membership client-roles (Coach/Director/Trainee)
 * in sync with the organization database.
 *
 * <p>Because a member can hold a role via several teams/sports, membership is
 * recomputed from the database ("has at least one such row") rather than toggled
 * per change. The sync runs after the surrounding transaction commits so it reads
 * the committed state, and a failed Keycloak call is logged but never rolls back
 * the org change.
 */
@Service
public class MemberRoleSyncService {

    private static final Logger LOG = LoggerFactory.getLogger(MemberRoleSyncService.class);

    @Autowired
    private TrainerRepository trainerRepository;
    @Autowired
    private DirectorRepository directorRepository;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private KeycloakRoleService keycloakRoleService;

    /**
     * Schedule a role re-sync for the given members once the current transaction
     * commits (or immediately if no transaction is active). Null/duplicate ids and
     * empty input are ignored.
     */
    public void scheduleSync(Collection<UUID> memberIds) {
        Set<UUID> ids = new HashSet<>();
        for (UUID id : memberIds) {
            if (id != null) {
                ids.add(id);
            }
        }
        if (ids.isEmpty()) {
            return;
        }
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    syncAll(ids);
                }
            });
        } else {
            syncAll(ids);
        }
    }

    private void syncAll(Set<UUID> ids) {
        for (UUID id : ids) {
            try {
                syncMember(id);
            } catch (RuntimeException e) {
                LOG.error("Failed to sync Keycloak roles for member {}", id, e);
            }
        }
    }

    void syncMember(UUID memberId) {
        Set<String> desired = new HashSet<>();
        if (!trainerRepository.findAllById_MemberId(memberId).isEmpty()) {
            desired.add(KeycloakRoleService.ROLE_COACH);
        }
        if (!directorRepository.findAllById_MemberId(memberId).isEmpty()) {
            desired.add(KeycloakRoleService.ROLE_DIRECTOR);
        }
        if (!traineeRepository.findAllById_MemberId(memberId).isEmpty()) {
            desired.add(KeycloakRoleService.ROLE_TRAINEE);
        }
        keycloakRoleService.reconcile(memberId, desired);
    }
}
