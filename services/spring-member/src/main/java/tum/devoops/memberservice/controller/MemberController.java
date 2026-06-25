package tum.devoops.memberservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberPartialUpdate;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.service.MemberService;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PreAuthorize("hasAnyRole('member', 'admin')")
    @GetMapping("/")
    public ResponseEntity<List<MemberSummary>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @PreAuthorize("hasAnyRole('member', 'admin')")
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberDetails(@PathVariable UUID id) {
        Optional<Member> memberOptional = memberService.getMemberById(id);
        return memberOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('admin')")
    @PostMapping("/")
    public ResponseEntity<Member> createMember(@Valid @RequestBody MemberCreate memberCreate, @AuthenticationPrincipal Jwt jwt) {
        try {
            Optional<Member> optionalMember = memberService.createMember(memberCreate, jwt.getTokenValue());
            if (optionalMember.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Member member = optionalMember.get();
            return ResponseEntity.created(URI.create("/" + member.getId())).body(member);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PreAuthorize("hasRole('admin') or hasRole('member') and #id.toString() == authentication.name")
    @PatchMapping("/{id}")
    public ResponseEntity<Member> updateMemberDetails(
            @PathVariable UUID id,
            @Valid @RequestBody MemberPartialUpdate memberPartialUpdate,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            Optional<Member> updated = memberService.updateMember(id, memberPartialUpdate, jwt.getTokenValue());
            return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        boolean deleted = memberService.deleteMember(id, jwt.getTokenValue());
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
