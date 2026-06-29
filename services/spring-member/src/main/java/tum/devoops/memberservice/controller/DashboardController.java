package tum.devoops.memberservice.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import tum.devoops.memberservice.model.Dashboard;
import tum.devoops.memberservice.service.DashboardService;

@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasAnyRole('member', 'admin')")
    @GetMapping("/dashboard")
    public ResponseEntity<Dashboard> getDashboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = UUID.fromString(((Jwt) auth.getPrincipal()).getSubject());
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_admin".equals(a.getAuthority()));
        return ResponseEntity.ok(dashboardService.getDashboard(requesterId, isAdmin));
    }
}
