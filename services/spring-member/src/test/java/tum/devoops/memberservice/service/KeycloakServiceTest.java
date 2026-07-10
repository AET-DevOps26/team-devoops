package tum.devoops.memberservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

class KeycloakServiceTest {

    private static final String BASE_URL = "http://keycloak.test";
    private static final String REALM = "test-realm";
    private static final String SERVICE_ACCOUNT_CLIENT_ID = "member-service";
    private static final String SERVICE_ACCOUNT_CLIENT_SECRET = "member-service-secret";
    private static final String SERVICE_ACCOUNT_TOKEN = "service-account-token";
    private static final String TOKEN_URI = BASE_URL + "/realms/" + REALM + "/protocol/openid-connect/token";
    private static final String USERS_URI = BASE_URL + "/admin/realms/" + REALM + "/users";
    private static final String MEMBER_ROLE_ID = "member-role-id";

    private MockRestServiceServer server;
    private KeycloakService keycloakService;

    private UUID id;
    private MemberCreate memberCreate;
    private Member member;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();

        keycloakService = new KeycloakService(builder, BASE_URL, REALM, SERVICE_ACCOUNT_CLIENT_ID, SERVICE_ACCOUNT_CLIENT_SECRET);

        id = UUID.randomUUID();

        memberCreate = new MemberCreate();
        memberCreate.setFirstName("firstName");
        memberCreate.setLastName("lastName");
        memberCreate.setEmail("email@email.com");
        memberCreate.setPassword("password123");

        member = new Member(
                id,
                "firstName",
                "lastName",
                "email@email.com",
                LocalDate.of(1990, 1, 1),
                "phoneNumber",
                "address",
                LocalDate.of(2020, 6, 15),
                "information"
        );
    }

    // Verifies that a successful creation returns the id parsed from the Location header
    // and assigns the "member" realm role so the account isn't stuck at 403 on first login
    @Test
    void createUserReturnsIdFromLocationHeader() throws Exception {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .header(HttpHeaders.LOCATION, USERS_URI + "/" + id));
        expectMemberRoleAssignment(id);

        UUID result = keycloakService.createUser(memberCreate);

        assertEquals(id, result);
    }

    // Verifies that creation succeeds when no email is set (username falls back to the member's name)
    @Test
    void createUserWithoutEmailReturnsId() throws Exception {
        memberCreate.setEmail(null);

        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .header(HttpHeaders.LOCATION, USERS_URI + "/" + id));
        expectMemberRoleAssignment(id);

        UUID result = keycloakService.createUser(memberCreate);

        assertEquals(id, result);
    }

    // Verifies that a 403 while assigning the member realm role is translated into a SecurityException
    @Test
    void createUserThrowsOnForbiddenRoleAssignment() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .header(HttpHeaders.LOCATION, USERS_URI + "/" + id));
        server.expect(requestTo(USERS_URI + "/" + id + "/role-mappings/realm/available"))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.FORBIDDEN));

        assertThrows(SecurityException.class, () -> keycloakService.createUser(memberCreate));
    }

    // Verifies that a missing "member" realm role fails loudly instead of silently leaving the user unassigned
    @Test
    void createUserThrowsWhenMemberRoleNotFound() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .header(HttpHeaders.LOCATION, USERS_URI + "/" + id));
        server.expect(requestTo(USERS_URI + "/" + id + "/role-mappings/realm/available"))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("[]"));

        assertThrows(IllegalStateException.class, () -> keycloakService.createUser(memberCreate));
    }

    // Verifies that a 409 conflict is translated into an IllegalAccessException
    @Test
    void createUserThrowsOnConflict() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.CONFLICT));

        assertThrows(IllegalAccessException.class, () -> keycloakService.createUser(memberCreate));
    }

    // Verifies that a 403 forbidden is translated into a SecurityException
    @Test
    void createUserThrowsOnForbidden() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.FORBIDDEN));

        assertThrows(SecurityException.class, () -> keycloakService.createUser(memberCreate));
    }

    // Verifies that a creation without a Location header fails with an IllegalStateException
    @Test
    void createUserThrowsWhenNoLocationHeader() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.CREATED));

        assertThrows(IllegalStateException.class, () -> keycloakService.createUser(memberCreate));
    }

    // Verifies that a successful update completes without throwing
    @Test
    void updateUserSucceeds() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI + "/" + id))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.NO_CONTENT));

        keycloakService.updateUser(member);
    }

    // Verifies that a 409 conflict is translated into an IllegalArgumentException
    @Test
    void updateUserThrowsOnConflict() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI + "/" + id))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.CONFLICT));

        assertThrows(IllegalArgumentException.class, () -> keycloakService.updateUser(member));
    }

    // Verifies that a 403 forbidden is translated into a SecurityException
    @Test
    void updateUserThrowsOnForbidden() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI + "/" + id))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.FORBIDDEN));

        assertThrows(SecurityException.class, () -> keycloakService.updateUser(member));
    }

    // Verifies that a successful deletion completes without throwing
    @Test
    void deleteUserSucceeds() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI + "/" + id))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.NO_CONTENT));

        keycloakService.deleteUser(id);
    }

    // Verifies that a 404 not found is translated into an IllegalArgumentException
    @Test
    void deleteUserThrowsOnNotFound() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI + "/" + id))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.NOT_FOUND));

        assertThrows(IllegalArgumentException.class, () -> keycloakService.deleteUser(id));
    }

    // Verifies that a 403 forbidden is translated into a SecurityException
    @Test
    void deleteUserThrowsOnForbidden() {
        expectServiceAccountTokenRequest();
        server.expect(requestTo(USERS_URI + "/" + id))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.FORBIDDEN));

        assertThrows(SecurityException.class, () -> keycloakService.deleteUser(id));
    }

    private void expectMemberRoleAssignment(UUID userId) {
        server.expect(requestTo(USERS_URI + "/" + userId + "/role-mappings/realm/available"))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("[{\"id\":\"" + MEMBER_ROLE_ID + "\",\"name\":\"member\"}]"));

        server.expect(requestTo(USERS_URI + "/" + userId + "/role-mappings/realm"))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer " + SERVICE_ACCOUNT_TOKEN))
                .andExpect(content().json("[{\"id\":\"" + MEMBER_ROLE_ID + "\",\"name\":\"member\"}]"))
                .andRespond(withStatus(HttpStatus.NO_CONTENT));
    }

    private void expectServiceAccountTokenRequest() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", SERVICE_ACCOUNT_CLIENT_ID);
        form.add("client_secret", SERVICE_ACCOUNT_CLIENT_SECRET);

        server.expect(requestTo(TOKEN_URI))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(content().formData(form))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"access_token\":\"" + SERVICE_ACCOUNT_TOKEN + "\",\"expires_in\":300}"));
    }
}
