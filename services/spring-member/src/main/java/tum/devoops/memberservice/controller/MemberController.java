package tum.devoops.memberservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;
import tum.devoops.memberservice.api.MembersApi;
import tum.devoops.memberservice.model.Dashboard;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberPartialUpdate;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.service.DashboardService;
import tum.devoops.memberservice.service.MemberService;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class MemberController implements MembersApi {

    private final MemberService memberService;
    private final DashboardService dashboardService;

    public MemberController(MemberService memberService, DashboardService dashboardService) {
        this.memberService = memberService;
        this.dashboardService = dashboardService;
    }

    @Override
    @PreAuthorize("hasAnyRole('member', 'admin')")
    public ResponseEntity<List<MemberSummary>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @Override
    @PreAuthorize("hasAnyRole('member', 'admin')")
    public ResponseEntity<Member> getMemberDetails(UUID id) {
        Optional<Member> memberOptional = memberService.getMemberById(id);
        return memberOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Member> createMember(@Valid MemberCreate memberCreate) {
        try {
            Optional<Member> optionalMember = memberService.createMember(memberCreate, currentJwt().getTokenValue());
            if (optionalMember.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Member member = optionalMember.get();
            return ResponseEntity.created(URI.create("/" + member.getId())).body(member);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @Override
    @PreAuthorize("hasRole('admin') or hasRole('member') and #id.toString() == authentication.name")
    public ResponseEntity<Member> updateMemberDetails(UUID id, @Valid MemberPartialUpdate memberPartialUpdate) {
        try {
            Optional<Member> updated = memberService.updateMember(id, memberPartialUpdate, currentJwt().getTokenValue());
            return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @Override
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteMember(UUID id) {
        boolean deleted = memberService.deleteMember(id, currentJwt().getTokenValue());
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @Override
    @PreAuthorize("hasAnyRole('member', 'admin')")
    public ResponseEntity<Dashboard> getDashboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = UUID.fromString(((Jwt) auth.getPrincipal()).getSubject());
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_admin".equals(a.getAuthority()));
        return ResponseEntity.ok(dashboardService.getDashboard(requesterId, isAdmin));
    }

    private static Jwt currentJwt() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Jwt) auth.getPrincipal();
    }
}
