package tum.devoops.organizationservice.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/**
 * Thin client over the Keycloak Admin REST API that grants/revokes the
 * membership client-roles (Coach/Director/Trainee) on the roles client.
 *
 * <p>Authenticates with its own service-account ({@code client_credentials}),
 * so it works regardless of which user triggered the change. Deliberately has
 * no repository dependency: it only needs the {@code keycloak.*} configuration,
 * so the context-load smoke test exercises those placeholders and fails fast if
 * they are unresolved.
 */
@Service
public class KeycloakRoleService {

    /** Client roles this service manages on the roles client. */
    static final String ROLE_COACH = "Coach";
    static final String ROLE_DIRECTOR = "Director";
    static final String ROLE_TRAINEE = "Trainee";
    static final Set<String> MANAGED_ROLES = Set.of(ROLE_COACH, ROLE_DIRECTOR, ROLE_TRAINEE);

    private static final long TOKEN_EXPIRY_LEEWAY_MS = 10_000L;

    private final RestClient restClient;
    private final String realm;
    private final String adminClientId;
    private final String adminClientSecret;
    private final String rolesClientId;

    private String cachedToken;
    private long tokenExpiresAt;
    private String cachedRolesClientUuid;
    private Map<String, RoleRep> cachedManagedRoleReps;

    public KeycloakRoleService(
            RestClient.Builder restClientBuilder,
            @Value("${keycloak.base-url}") String baseUrl,
            @Value("${keycloak.realm}") String realm,
            @Value("${keycloak.admin.client-id}") String adminClientId,
            @Value("${keycloak.admin.client-secret}") String adminClientSecret,
            @Value("${keycloak.roles-client}") String rolesClientId) {
        this.restClient = restClientBuilder.baseUrl(baseUrl).build();
        this.realm = realm;
        this.adminClientId = adminClientId;
        this.adminClientSecret = adminClientSecret;
        this.rolesClientId = rolesClientId;
    }

    /**
     * Reconcile the managed client-roles of a user to match {@code desiredRoles}
     * (a subset of {@link #MANAGED_ROLES}), adding the missing ones and removing
     * the stale ones. Roles outside the managed set (e.g. Admin) are untouched.
     */
    public void reconcile(UUID userId, Set<String> desiredRoles) {
        String clientUuid = resolveRolesClientUuid();
        Map<String, RoleRep> roleReps = resolveManagedRoleReps(clientUuid);
        Set<String> current = getAssignedManagedRoles(userId, clientUuid);

        List<RoleRep> toAdd = desiredRoles.stream()
                .filter(name -> !current.contains(name))
                .map(roleReps::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        List<RoleRep> toRemove = current.stream()
                .filter(name -> !desiredRoles.contains(name))
                .map(roleReps::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (!toAdd.isEmpty()) {
            restClient.post()
                    .uri("/admin/realms/{realm}/users/{id}/role-mappings/clients/{client}", realm, userId, clientUuid)
                    .header("Authorization", bearer())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(toAdd)
                    .retrieve()
                    .toBodilessEntity();
        }
        if (!toRemove.isEmpty()) {
            restClient.method(HttpMethod.DELETE)
                    .uri("/admin/realms/{realm}/users/{id}/role-mappings/clients/{client}", realm, userId, clientUuid)
                    .header("Authorization", bearer())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(toRemove)
                    .retrieve()
                    .toBodilessEntity();
        }
    }

    private Set<String> getAssignedManagedRoles(UUID userId, String clientUuid) {
        RoleRep[] roles = restClient.get()
                .uri("/admin/realms/{realm}/users/{id}/role-mappings/clients/{client}", realm, userId, clientUuid)
                .header("Authorization", bearer())
                .retrieve()
                .body(RoleRep[].class);
        Set<String> result = new HashSet<>();
        if (roles != null) {
            for (RoleRep role : roles) {
                if (MANAGED_ROLES.contains(role.name())) {
                    result.add(role.name());
                }
            }
        }
        return result;
    }

    private synchronized String resolveRolesClientUuid() {
        if (cachedRolesClientUuid != null) {
            return cachedRolesClientUuid;
        }
        ClientRep[] clients = restClient.get()
                .uri("/admin/realms/{realm}/clients?clientId={clientId}", realm, rolesClientId)
                .header("Authorization", bearer())
                .retrieve()
                .body(ClientRep[].class);
        if (clients == null || clients.length == 0) {
            throw new IllegalStateException("Keycloak client not found: " + rolesClientId);
        }
        cachedRolesClientUuid = clients[0].id();
        return cachedRolesClientUuid;
    }

    private synchronized Map<String, RoleRep> resolveManagedRoleReps(String clientUuid) {
        if (cachedManagedRoleReps != null) {
            return cachedManagedRoleReps;
        }
        RoleRep[] roles = restClient.get()
                .uri("/admin/realms/{realm}/clients/{client}/roles", realm, clientUuid)
                .header("Authorization", bearer())
                .retrieve()
                .body(RoleRep[].class);
        Map<String, RoleRep> reps = new HashMap<>();
        if (roles != null) {
            for (RoleRep role : roles) {
                if (MANAGED_ROLES.contains(role.name())) {
                    reps.put(role.name(), role);
                }
            }
        }
        cachedManagedRoleReps = reps;
        return reps;
    }

    private synchronized String bearer() {
        if (cachedToken == null || System.currentTimeMillis() >= tokenExpiresAt) {
            fetchToken();
        }
        return "Bearer " + cachedToken;
    }

    private void fetchToken() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", adminClientId);
        form.add("client_secret", adminClientSecret);

        TokenResponse response = restClient.post()
                .uri("/realms/{realm}/protocol/openid-connect/token", realm)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(TokenResponse.class);
        if (response == null || response.accessToken() == null) {
            throw new IllegalStateException("Keycloak did not return an access token");
        }
        this.cachedToken = response.accessToken();
        this.tokenExpiresAt = System.currentTimeMillis()
                + Math.max(0L, response.expiresIn() * 1000L - TOKEN_EXPIRY_LEEWAY_MS);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record TokenResponse(
            @JsonProperty("access_token") String accessToken,
            @JsonProperty("expires_in") long expiresIn) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ClientRep(String id, String clientId) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record RoleRep(String id, String name) {
    }
}
