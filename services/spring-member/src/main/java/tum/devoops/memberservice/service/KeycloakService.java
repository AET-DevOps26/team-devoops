package tum.devoops.memberservice.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;

import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class KeycloakService {

    private static final long TOKEN_REFRESH_SKEW_SECONDS = 30L;

    private final RestClient restClient;
    private final String realm;
    private final String serviceAccountClientId;
    private final String serviceAccountClientSecret;

    private volatile String cachedServiceAccountToken;
    private volatile Instant cachedServiceAccountTokenExpiresAt = Instant.EPOCH;

    public KeycloakService(RestClient.Builder restClientBuilder,
                           @Value("${keycloak.base-url}") String baseUrl,
                           @Value("${keycloak.realm}") String realm,
                           @Value("${keycloak.service-account.client-id}") String serviceAccountClientId,
                           @Value("${keycloak.service-account.client-secret}") String serviceAccountClientSecret) {
        this.restClient = restClientBuilder.baseUrl(baseUrl).build();
        this.realm = realm;
        this.serviceAccountClientId = serviceAccountClientId;
        this.serviceAccountClientSecret = serviceAccountClientSecret;
    }

    public UUID createUser(MemberCreate member) throws Exception {
        String username = member.getEmail() != null
                ? member.getEmail()
                : (member.getFirstName() + member.getLastName()).toLowerCase();

        // temporary=true: Keycloak forces an UPDATE_PASSWORD required action on first login,
        // so the admin-chosen initial password never lingers as the member's permanent one.
        List<Credential> credentials = member.getPassword() != null
                ? List.of(new Credential("password", member.getPassword(), true))
                : List.of();

        UserRepresentation body = new UserRepresentation(
                username, member.getFirstName(), member.getLastName(), member.getEmail(), true, credentials);

        ResponseEntity<Void> response;

        try {
            response = restClient.post()
                    .uri("/admin/realms/{realm}/users", realm)
                    .header(HttpHeaders.AUTHORIZATION, authorizationHeader())
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

    public void updateUser(Member member) throws HttpClientErrorException {

        UserUpdateRepresentation body = new UserUpdateRepresentation(member.getFirstName(),
                member.getLastName(), member.getEmail(), true);

        try {
            restClient.put()
                    .uri("/admin/realms/{realm}/users/{id}", realm, member.getId())
                    .header(HttpHeaders.AUTHORIZATION, authorizationHeader())
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

    public void deleteUser(UUID keycloakId) throws HttpClientErrorException, SecurityException {
        try {
            restClient.delete()
                    .uri("/admin/realms/{realm}/users/{id}", realm, keycloakId)
                    .header(HttpHeaders.AUTHORIZATION, authorizationHeader())
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalArgumentException("Keycloak user not found: " + keycloakId);
        } catch (HttpClientErrorException.Forbidden e) {
            throw new SecurityException("Insufficient permissions to delete a keycloak user");
        }
    }

    private String authorizationHeader() {
        return "Bearer " + serviceAccountToken();
    }

    private String serviceAccountToken() {
        Instant now = Instant.now();
        if (cachedServiceAccountToken != null && now.isBefore(cachedServiceAccountTokenExpiresAt)) {
            return cachedServiceAccountToken;
        }

        synchronized (this) {
            now = Instant.now();
            if (cachedServiceAccountToken != null && now.isBefore(cachedServiceAccountTokenExpiresAt)) {
                return cachedServiceAccountToken;
            }

            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("grant_type", "client_credentials");
            form.add("client_id", serviceAccountClientId);
            form.add("client_secret", serviceAccountClientSecret);

            TokenResponse response = restClient.post()
                    .uri("/realms/{realm}/protocol/openid-connect/token", realm)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(TokenResponse.class);

            if (response == null || response.accessToken() == null || response.accessToken().isBlank()) {
                throw new IllegalStateException("Keycloak did not return a service account access token");
            }

            cachedServiceAccountToken = response.accessToken();
            cachedServiceAccountTokenExpiresAt = now.plusSeconds(cacheTtlSeconds(response.expiresIn()));
            return cachedServiceAccountToken;
        }
    }

    private static long cacheTtlSeconds(Long expiresIn) {
        if (expiresIn == null || expiresIn <= 0) {
            return 0;
        }
        return Math.max(1, expiresIn - TOKEN_REFRESH_SKEW_SECONDS);
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

    private record TokenResponse(
            @JsonProperty("access_token") String accessToken,
            @JsonProperty("expires_in") Long expiresIn
    ) {}
}
