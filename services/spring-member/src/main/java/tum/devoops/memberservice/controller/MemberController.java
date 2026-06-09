package tum.devoops.memberservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.service.MemberService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class MemberController {

    @Autowired
    MemberService memberService;

    /**
     * Retrieves all members.
     * <p>
     * This endpoint searches the primary database and returns all members.
     * Only the MemberSummary is returned.
     * </p>
     * @return ResponseEntity containing a List of MemberSummary and HTTP 200
     */
    @PreAuthorize("hasAnyRole('member', 'admin')")
    @GetMapping("/")
    public ResponseEntity<List<MemberSummary>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    /**
     * Retrieves a member given its ID.
     * <p>
     * This endpoint searches the primary database and returns the corresponding member to an ID.
     * </p>
     * @param The unique {@link UUID} of the member.
     * @return ResponseEntity containing a List of MemberSummary and HTTP 200. If the member is not found an empty ResponseEntity with HTTP 404 is returned.
     */
    @PreAuthorize("hasAnyRole('member', 'admin')")
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable UUID id) {
        Optional<Member> memberOptional = memberService.getMemberById(id);

        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            return ResponseEntity.ok(member);
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

}
