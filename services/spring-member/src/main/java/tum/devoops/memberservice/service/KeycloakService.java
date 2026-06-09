package tum.devoops.memberservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import tum.devoops.memberservice.model.MemberCreate;

import java.net.URI;
import java.util.UUID;

@Service
public class KeycloakService {

    private final RestClient restClient;
    @Value("${keycloak.realm}")
    private String realm;

    public KeycloakService(RestClient.Builder restClientBuilder, @Value("${keycloak.base-url}") String baseUrl) {
        this.restClient = restClientBuilder.baseUrl(baseUrl).build();
    }

    public UUID createUser(MemberCreate member, String bearerToken) throws IllegalAccessException {
        String username = member.getEmail() != null ? member.getEmail() : (member.getFirstName() + member.getLastName()).toLowerCase();

        UserRepresentation body = new UserRepresentation(username, member.getFirstName(), member.getLastName(), member.getEmail(), true);

        ResponseEntity<Void> response;

        try{
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

    private record UserRepresentation(
            String username,
            String firstName,
            String lastName, String
            email, boolean enabled
    ) {}
}
