package tum.devoops.organizationservice;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tum.devoops.organizationservice.exception.ConflictException;
import tum.devoops.organizationservice.exception.ForbiddenException;
import tum.devoops.organizationservice.exception.NotFoundException;
import tum.devoops.organizationservice.model.Sport;
import tum.devoops.organizationservice.service.OrganizationSportService;
import tum.devoops.organizationservice.service.OrganizationTeamService;

@SpringBootTest(properties = {
        "spring.autoconfigure.exclude=" +
                "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration," +
                "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration"
})
@TestPropertySource(properties = {"spring.jpa.hibernate.ddl-auto=none"})
@AutoConfigureMockMvc
class OrganizationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrganizationSportService sportService;

    @MockitoBean
    private OrganizationTeamService teamService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    private static final UUID ADMIN_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID MEMBER_ID = UUID.fromString("00000000-0000-0000-0000-000000000002");

    private RequestPostProcessor adminJwt() {
        return jwt()
                .jwt(j -> j.subject(ADMIN_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_admin"));
    }

    private RequestPostProcessor memberJwt() {
        return jwt()
                .jwt(j -> j.subject(MEMBER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_member"));
    }

    private Sport sport(String name) {
        return new Sport(name, "A test sport", LocalDate.of(2024, 1, 1), List.of());
    }

    // --- getAllSports ---

    @Test
    void getAllSports_returns200_withList_whenMemberAuthenticated() throws Exception {
        when(sportService.getAllSports()).thenReturn(List.of(sport("soccer"), sport("tennis")));

        mockMvc.perform(get("/organization/sports").with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("soccer"))
                .andExpect(jsonPath("$[1].name").value("tennis"));
    }

    @Test
    void getAllSports_returns200_withEmptyList_whenNoSports() throws Exception {
        when(sportService.getAllSports()).thenReturn(List.of());

        mockMvc.perform(get("/organization/sports").with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getAllSports_returns401_whenUnauthenticated() throws Exception {
        mockMvc.perform(get("/organization/sports"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAllSports_returns403_whenNoOrgRole() throws Exception {
        mockMvc.perform(get("/organization/sports")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_trainer"))))
                .andExpect(status().isForbidden());
    }

    // --- getSport ---

    @Test
    void getSport_returns200_withSport_whenFound() throws Exception {
        when(sportService.getSport("soccer")).thenReturn(sport("soccer"));

        mockMvc.perform(get("/organization/sports/soccer").with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("soccer"));
    }

    @Test
    void getSport_returns404_whenNotFound() throws Exception {
        when(sportService.getSport("unknown")).thenThrow(new NotFoundException("Sport not found: unknown"));

        mockMvc.perform(get("/organization/sports/unknown").with(memberJwt()))
                .andExpect(status().isNotFound());
    }

    @Test
    void getSport_returns401_whenUnauthenticated() throws Exception {
        mockMvc.perform(get("/organization/sports/soccer"))
                .andExpect(status().isUnauthorized());
    }

    // --- createSport ---

    @Test
    void createSport_returns201_withSport_whenAdmin() throws Exception {
        when(sportService.createSport(any())).thenReturn(sport("soccer"));

        mockMvc.perform(post("/organization/sports")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"soccer\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("soccer"));
    }

    @Test
    void createSport_returns403_whenMember() throws Exception {
        mockMvc.perform(post("/organization/sports")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"soccer\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void createSport_returns401_whenUnauthenticated() throws Exception {
        mockMvc.perform(post("/organization/sports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"soccer\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createSport_returns409_whenConflict() throws Exception {
        when(sportService.createSport(any())).thenThrow(new ConflictException("Sport already exists: soccer"));

        mockMvc.perform(post("/organization/sports")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"soccer\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void createSport_returns400_whenNameMissing() throws Exception {
        mockMvc.perform(post("/organization/sports")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    // --- updateSport ---

    @Test
    void updateSport_returns200_whenAdmin() throws Exception {
        when(sportService.updateSport(eq("soccer"), any(), eq(ADMIN_ID), eq(true)))
                .thenReturn(sport("soccer"));

        mockMvc.perform(patch("/organization/sports/soccer")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"description\":\"updated\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("soccer"));
    }

    @Test
    void updateSport_returns200_whenMember() throws Exception {
        when(sportService.updateSport(eq("soccer"), any(), eq(MEMBER_ID), eq(false)))
                .thenReturn(sport("soccer"));

        mockMvc.perform(patch("/organization/sports/soccer")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"description\":\"updated\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void updateSport_passesRequesterIdAndIsAdminTrue_fromAdminJwt() throws Exception {
        when(sportService.updateSport(any(), any(), any(), anyBoolean())).thenReturn(sport("soccer"));

        mockMvc.perform(patch("/organization/sports/soccer")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk());

        verify(sportService).updateSport(eq("soccer"), any(), eq(ADMIN_ID), eq(true));
    }

    @Test
    void updateSport_passesRequesterIdAndIsAdminFalse_fromMemberJwt() throws Exception {
        when(sportService.updateSport(any(), any(), any(), anyBoolean())).thenReturn(sport("soccer"));

        mockMvc.perform(patch("/organization/sports/soccer")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk());

        verify(sportService).updateSport(eq("soccer"), any(), eq(MEMBER_ID), eq(false));
    }

    @Test
    void updateSport_returns404_whenNotFound() throws Exception {
        when(sportService.updateSport(eq("unknown"), any(), any(), anyBoolean()))
                .thenThrow(new NotFoundException("Sport not found: unknown"));

        mockMvc.perform(patch("/organization/sports/unknown")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateSport_returns403_whenForbidden() throws Exception {
        when(sportService.updateSport(eq("soccer"), any(), any(), anyBoolean()))
                .thenThrow(new ForbiddenException("Access denied"));

        mockMvc.perform(patch("/organization/sports/soccer")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateSport_returns409_whenRenameConflict() throws Exception {
        when(sportService.updateSport(eq("soccer"), any(), any(), anyBoolean()))
                .thenThrow(new ConflictException("Sport already exists: football"));

        mockMvc.perform(patch("/organization/sports/soccer")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"football\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void updateSport_returns401_whenUnauthenticated() throws Exception {
        mockMvc.perform(patch("/organization/sports/soccer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    // --- deleteSport ---

    @Test
    void deleteSport_returns204_whenAdmin() throws Exception {
        mockMvc.perform(delete("/organization/sports/soccer").with(adminJwt()))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteSport_returns403_whenMember() throws Exception {
        mockMvc.perform(delete("/organization/sports/soccer").with(memberJwt()))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteSport_returns404_whenNotFound() throws Exception {
        doThrow(new NotFoundException("Sport not found: unknown"))
                .when(sportService).deleteSport("unknown");

        mockMvc.perform(delete("/organization/sports/unknown").with(adminJwt()))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteSport_returns401_whenUnauthenticated() throws Exception {
        mockMvc.perform(delete("/organization/sports/soccer"))
                .andExpect(status().isUnauthorized());
    }
}
