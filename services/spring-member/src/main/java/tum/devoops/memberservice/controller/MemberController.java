package tum.devoops.memberservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.service.MemberService;

import java.net.URI;
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
     * @param id The unique {@link UUID} of the member.
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

    /**
     * Creates a member in the member-db and the corresponding user in keycloak
     * <p>
     * This endpoint creates a member and further creates a corresponding user in keycloak using the email of the member as username.
     * If the email is null, the username is firstName.lastName
     * </p>
     * @param memberCreate the member without id.
     * @return ResponseEntity containing the created member and HTTP 201. If the email or username exists, returns HTTP 400.
     */
    @PreAuthorize("hasRole('admin')")
    @PostMapping("/")
    public ResponseEntity<Member> createMember(@RequestBody MemberCreate memberCreate, @AuthenticationPrincipal Jwt jwt) {
        Member member;
        try{
            member = memberService.createMember(memberCreate, jwt.getTokenValue());
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.created(URI.create("/" + member.getId())).body(member);
    }

    /**
     * Updates a member in the member db and the keycloak db (if email changes)
     * <p>
     * This endpoint updates a member and further updates the corresponding user in keycloak.
     * </p>
     * @param newMember the updated member.
     * @return ResponseEntity containing the updated member and HTTP 200. If the member does not exist, return HTTP 404.
     */
    @PreAuthorize("hasRole('admin') or hasRole('member') and #newMember.id.toString() == authentication.name")
    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable UUID id, @RequestBody Member newMember, @AuthenticationPrincipal Jwt jwt) {

        Optional<Member> newMemberOptional = memberService.updateMember(newMember);

        if (newMemberOptional.isPresent()) {
            newMember = newMemberOptional.get();
            return ResponseEntity.ok(newMember);
        }
        else {
            return  ResponseEntity.notFound().build();
        }
    }
}
