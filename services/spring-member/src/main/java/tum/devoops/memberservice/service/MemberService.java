package tum.devoops.memberservice.service;

import org.springframework.stereotype.Service;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberSummary;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MemberService {

    public List<MemberSummary> getAllMembers() {
        return List.of();
    }

    public Optional<Member> getMemberById(UUID id) {
        return null;
    }
}
