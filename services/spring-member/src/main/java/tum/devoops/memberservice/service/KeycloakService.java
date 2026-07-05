package tum.devoops.memberservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@Service
public class KeycloakService {

    private final RestClient restClient;
    @Value("${keycloak.realm}")
    private String realm;

    public KeycloakService(RestClient.Builder restClientBuilder, @Value("${keycloak.base-url}") String baseUrl) {
        this.restClient = restClientBuilder.baseUrl(baseUrl).build();
    }

    public UUID createUser(MemberCreate member, String bearerToken) throws Exception {
        String username = member.getEmail() != null ? member.getEmail() : (member.getFirstName() + member.getLastName()).toLowerCase();

        List<Credential> credentials = member.getPassword() != null
                ? List.of(new Credential("password", member.getPassword(), false))
                : List.of();

        UserRepresentation body = new UserRepresentation(
                username, member.getFirstName(), member.getLastName(), member.getEmail(), true, credentials);

        ResponseEntity<Void> response;

        try {
            response = restClient.post()
                    .uri("/admin/realms/{realm}/users", realm)
                    .header("Authorization", "Bearer " + bearerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException.Conflict e) {
            throw new IllegalAccessException("A keycloak user with this username/email already exists");
        } catch (HttpClientErrorException.Forbidden e) {
            throw new SecurityException("Insufficient permissions to create a keycloak user");
        }

        URI location = response.getHeaders().getLocation();

        if (location == null) {
            throw new IllegalStateException("Keycloak did not return a location header after user creation");
        }

        String path = location.getPath();
        return UUID.fromString(path.substring(path.lastIndexOf("/") + 1));
    }

    public void updateUser(Member member, String bearerToken) throws HttpClientErrorException {

        UserUpdateRepresentation body = new UserUpdateRepresentation(member.getFirstName(),
                member.getLastName(), member.getEmail(), true);

        try {
            restClient.put()
                    .uri("/admin/realms/{realm}/users/{id}", realm, member.getId())
                    .header("Authorization", "Bearer " + bearerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException.Conflict e) {
            throw new IllegalArgumentException("A Keycloak user with this email already exists");
        } catch (HttpClientErrorException.Forbidden e) {
            throw new SecurityException("Insufficient permissions to update this Keycloak user");
        }
    }

    public void deleteUser(UUID keycloakId, String bearerToken) throws HttpClientErrorException, SecurityException {
        try {
            restClient.delete()
                    .uri("/admin/realms/{realm}/users/{id}", realm, keycloakId)
                    .header("Authorization", "Bearer " + bearerToken)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalArgumentException("Keycloak user not found: " + keycloakId);
        } catch (HttpClientErrorException.Forbidden e) {
            throw new SecurityException("Insufficient permissions to delete a keycloak user");
        }
    }

    private record UserRepresentation(
            String username,
            String firstName,
            String lastName,
            String email,
            boolean enabled,
            List<Credential> credentials
    ) {}

    // Excludes "username": Keycloak rejects any update payload that touches it once
    // the User Profile config marks the attribute read-only, even to its existing value.
    private record UserUpdateRepresentation(
            String firstName,
            String lastName,
            String email,
            boolean enabled
    ) {}

    private record Credential(String type, String value, boolean temporary) {}
}
