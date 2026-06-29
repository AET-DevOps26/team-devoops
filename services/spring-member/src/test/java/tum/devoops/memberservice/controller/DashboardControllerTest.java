package tum.devoops.memberservice.controller;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import tum.devoops.memberservice.config.SecurityConfig;
import tum.devoops.memberservice.model.AdminDashboard;
import tum.devoops.memberservice.model.TraineeDashboard;
import tum.devoops.memberservice.service.DashboardService;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
@Import(SecurityConfig.class)
public class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DashboardService dashboardService;

    private static final UUID REQUESTER_ID = UUID.randomUUID();

    @Test
    void getDashboard_returns200WithTraineeShape_forMember() throws Exception {
        TraineeDashboard dashboard = new TraineeDashboard("trainee", 1500, null, 2, List.of(), List.of());
        when(dashboardService.getDashboard(REQUESTER_ID, false)).thenReturn(dashboard);

        mockMvc.perform(get("/dashboard")
                        .with(jwt()
                                .jwt(j -> j.subject(REQUESTER_ID.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("trainee"))
                .andExpect(jsonPath("$.balance_cents").value(1500))
                .andExpect(jsonPath("$.upcoming_events").value(2));
    }

    @Test
    void getDashboard_returns200WithAdminShape_forAdmin() throws Exception {
        AdminDashboard dashboard = new AdminDashboard("admin", 42, 3, 7, 2, 5, 99000, 4);
        when(dashboardService.getDashboard(REQUESTER_ID, true)).thenReturn(dashboard);

        mockMvc.perform(get("/dashboard")
                        .with(jwt()
                                .jwt(j -> j.subject(REQUESTER_ID.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("admin"))
                .andExpect(jsonPath("$.total_members").value(42))
                .andExpect(jsonPath("$.total_balance_cents").value(99000));
    }

    @Test
    void getDashboard_returns403_forDisallowedRole() throws Exception {
        mockMvc.perform(get("/dashboard")
                        .with(jwt()
                                .jwt(j -> j.subject(REQUESTER_ID.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_guest"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    void getDashboard_returns401_whenAnonymous() throws Exception {
        mockMvc.perform(get("/dashboard"))
                .andExpect(status().isUnauthorized());
    }
}
