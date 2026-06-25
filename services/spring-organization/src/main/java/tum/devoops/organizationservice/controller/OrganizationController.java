package tum.devoops.organizationservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import tum.devoops.organizationservice.api.OrganizationApi;
import tum.devoops.organizationservice.model.Sport;
import tum.devoops.organizationservice.model.SportCreate;
import tum.devoops.organizationservice.model.SportPartialUpdate;
import tum.devoops.organizationservice.model.Team;
import tum.devoops.organizationservice.model.TeamCreate;
import tum.devoops.organizationservice.model.TeamPartialUpdate;
import tum.devoops.organizationservice.service.OrganizationSportService;
import tum.devoops.organizationservice.service.OrganizationTeamService;

@RestController
@PreAuthorize("hasAnyRole('admin', 'member')")
public class OrganizationController implements OrganizationApi {

    @Autowired
    private OrganizationSportService sportService;

    @Autowired
    private OrganizationTeamService teamService;

    @Override
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @Override
    public ResponseEntity<Team> getTeam(UUID teamId) {
        return ResponseEntity.ok(teamService.getTeam(teamId));
    }

    @Override
    public ResponseEntity<Team> createTeam(TeamCreate teamCreate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.createTeam(teamCreate, requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Team> updateTeam(UUID teamId, TeamPartialUpdate teamPartialUpdate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(teamService.updateTeam(teamId, teamPartialUpdate, requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Void> deleteTeam(UUID teamId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        teamService.deleteTeam(teamId, requesterId, isAdmin);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<Sport>> getAllSports() {
        return ResponseEntity.ok(sportService.getAllSports());
    }

    @Override
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Sport> createSport(SportCreate sportCreate) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sportService.createSport(sportCreate));
    }

    @Override
    public ResponseEntity<Sport> getSport(String sportName) {
        return ResponseEntity.ok(sportService.getSport(sportName));
    }

    @Override
    public ResponseEntity<Sport> updateSport(String sportName, SportPartialUpdate sportPartialUpdate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(sportService.updateSport(sportName, sportPartialUpdate, requesterId, isAdmin));
    }

    @Override
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteSport(String sportName) {
        sportService.deleteSport(sportName);
        return ResponseEntity.noContent().build();
    }

    private UUID extractRequesterId(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        return UUID.fromString(jwt.getSubject());
    }

    private boolean extractIsAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_admin".equals(a.getAuthority()));
    }
}
