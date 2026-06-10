package tum.devoops.memberservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberSummary;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MemberService {

    @Autowired
    KeycloakService keycloakService;

    public List<MemberSummary> getAllMembers() {
        return List.of();
    }

    public Optional<MemberSummary> getMemberById(UUID id) {
        return Optional.empty();
    }

    public Optional<Member> getMemberDetailsById(UUID id) {
        return Optional.empty();
    }

    private Member createMemberFromDTO(MemberCreate memberCreate, UUID id) {
        return new Member(
                id,
                memberCreate.getFirstName(),
                memberCreate.getLastName(),
                memberCreate.getEmail(),
                memberCreate.getBirthday(),
                memberCreate.getPhoneNumber(),
                memberCreate.getAddress(),
                LocalDate.now(),
                memberCreate.getInformation()
        );
    }

    public Member createMember(MemberCreate memberCreate, String bearerToken) throws IllegalAccessException {
        UUID id = keycloakService.createUser(memberCreate, bearerToken);
        // TODO Store member in database
        return createMemberFromDTO(memberCreate, id);
    }

    public Optional<Member> updateMember(Member member) {
        // TODO Update email in keycloak
        return Optional.empty();
    }

}
