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

import javax.swing.text.html.Option;
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
     * @return ResponseEntity containing a MemberSummary and HTTP 200. If the member is not found an empty ResponseEntity with HTTP 404 is returned.
     */
    @PreAuthorize("hasAnyRole('member', 'admin')")
    @GetMapping("/{id}")
    public ResponseEntity<MemberSummary> getMemberSummaryById(@PathVariable UUID id) {
        Optional<MemberSummary> memberOptional = memberService.getMemberSummaryById(id);

        if (memberOptional.isPresent()) {
            MemberSummary member = memberOptional.get();
            return ResponseEntity.ok(member);
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Retrieves a member with all details given its ID.
     * <p>
     * This endpoint searches the primary database and returns the corresponding member to an ID.
     * </p>
     * @param id The unique {@link UUID} of the member.
     * @return ResponseEntity containing a Member and HTTP 200. If the member is not found an empty ResponseEntity with HTTP 404 is returned.
     */
    @PreAuthorize("hasAnyRole('member', 'admin')")
    @GetMapping("/{id}/details")
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
        Optional<Member> optionalMember = memberService.createMember(memberCreate, jwt.getTokenValue());

        if (optionalMember.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Member member = optionalMember.get();

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

        Optional<Member> newMemberOptional = memberService.updateMember(newMember, jwt.getTokenValue());

        if (newMemberOptional.isEmpty()) {
            return  ResponseEntity.notFound().build();
        }

        newMember = newMemberOptional.get();
        return ResponseEntity.ok(newMember);
    }

    /**
     * Deletes a member in the member db and the keycloak db
     * <p>
     * This endpoint deletes a member and further deletes the corresponding user in keycloak.
     * </p>
     * @param id the id of the member to be deleted.
     * @return Empty response and HTTP 204. If the member does not exist, return HTTP 404.
     */
    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Member> deleteMember(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {

        boolean isDeleted = memberService.deleteMember(id, jwt.getTokenValue());

        if (isDeleted) {
            return ResponseEntity.noContent().build();
        }
        else {
            return  ResponseEntity.notFound().build();
        }
    }
}
