package tum.devoops.memberservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.service.MemberService;

import java.util.List;

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

}
