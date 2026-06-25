package tum.devoops.memberservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

class KeycloakServiceTest {

    private static final String BASE_URL = "http://keycloak.test";
    private static final String REALM = "test-realm";
    private static final String TOKEN = "mock-token";
    private static final String USERS_URI = BASE_URL + "/admin/realms/" + REALM + "/users";

    private MockRestServiceServer server;
    private KeycloakService keycloakService;

    private UUID id;
    private MemberCreate memberCreate;
    private Member member;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();

        keycloakService = new KeycloakService(builder, BASE_URL);
        ReflectionTestUtils.setField(keycloakService, "realm", REALM);

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
    @Test
    void createUserReturnsIdFromLocationHeader() throws Exception {
        server.expect(requestTo(USERS_URI))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .header(HttpHeaders.LOCATION, USERS_URI + "/" + id));

        UUID result = keycloakService.createUser(memberCreate, TOKEN);

        assertEquals(id, result);
    }

    // Verifies that creation succeeds when no email is set (username falls back to the member's name)
    @Test
    void createUserWithoutEmailReturnsId() throws Exception {
        memberCreate.setEmail(null);

        server.expect(requestTo(USERS_URI))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .header(HttpHeaders.LOCATION, USERS_URI + "/" + id));

        UUID result = keycloakService.createUser(memberCreate, TOKEN);

        assertEquals(id, result);
    }

    // Verifies that a 409 conflict is translated into an IllegalAccessException
    @Test
    void createUserThrowsOnConflict() {
        server.expect(requestTo(USERS_URI))
                .andRespond(withStatus(HttpStatus.CONFLICT));

        assertThrows(IllegalAccessException.class, () -> keycloakService.createUser(memberCreate, TOKEN));
    }

    // Verifies that a 403 forbidden is translated into a SecurityException
    @Test
    void createUserThrowsOnForbidden() {
        server.expect(requestTo(USERS_URI))
                .andRespond(withStatus(HttpStatus.FORBIDDEN));

        assertThrows(SecurityException.class, () -> keycloakService.createUser(memberCreate, TOKEN));
    }

    // Verifies that a creation without a Location header fails with an IllegalStateException
    @Test
    void createUserThrowsWhenNoLocationHeader() {
        server.expect(requestTo(USERS_URI))
                .andRespond(withStatus(HttpStatus.CREATED));

        assertThrows(IllegalStateException.class, () -> keycloakService.createUser(memberCreate, TOKEN));
    }

    // Verifies that a successful update completes without throwing
    @Test
    void updateUserSucceeds() {
        server.expect(requestTo(USERS_URI + "/" + id))
                .andRespond(withStatus(HttpStatus.NO_CONTENT));

        keycloakService.updateUser(member, TOKEN);
    }

    // Verifies that a 409 conflict is translated into an IllegalArgumentException
    @Test
    void updateUserThrowsOnConflict() {
        server.expect(requestTo(USERS_URI + "/" + id))
                .andRespond(withStatus(HttpStatus.CONFLICT));

        assertThrows(IllegalArgumentException.class, () -> keycloakService.updateUser(member, TOKEN));
    }

    // Verifies that a 403 forbidden is translated into a SecurityException
    @Test
    void updateUserThrowsOnForbidden() {
        server.expect(requestTo(USERS_URI + "/" + id))
                .andRespond(withStatus(HttpStatus.FORBIDDEN));

        assertThrows(SecurityException.class, () -> keycloakService.updateUser(member, TOKEN));
    }

    // Verifies that a successful deletion completes without throwing
    @Test
    void deleteUserSucceeds() {
        server.expect(requestTo(USERS_URI + "/" + id))
                .andRespond(withStatus(HttpStatus.NO_CONTENT));

        keycloakService.deleteUser(id, TOKEN);
    }

    // Verifies that a 404 not found is translated into an IllegalArgumentException
    @Test
    void deleteUserThrowsOnNotFound() {
        server.expect(requestTo(USERS_URI + "/" + id))
                .andRespond(withStatus(HttpStatus.NOT_FOUND));

        assertThrows(IllegalArgumentException.class, () -> keycloakService.deleteUser(id, TOKEN));
    }

    // Verifies that a 403 forbidden is translated into a SecurityException
    @Test
    void deleteUserThrowsOnForbidden() {
        server.expect(requestTo(USERS_URI + "/" + id))
                .andRespond(withStatus(HttpStatus.FORBIDDEN));

        assertThrows(SecurityException.class, () -> keycloakService.deleteUser(id, TOKEN));
    }
}
