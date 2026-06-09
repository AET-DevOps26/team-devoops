package tum.devoops.memberservice.service;

import org.springframework.stereotype.Service;
import tum.devoops.memberservice.model.MemberSummary;

import java.util.List;

@Service
public class MemberService {

    public List<MemberSummary> getAllMembers() {
        return List.of();
    }
}
