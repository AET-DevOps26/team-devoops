package tum.devoops.organizationservice;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import tum.devoops.organizationservice.config.SecurityConfig;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class SecurityConfigTest {

    private final var converter = new SecurityConfig().jwtAuthenticationConverter();

    private Jwt jwtWithRoles(List<String> roles) {
        return Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .claim("sub", "test-user")
                .claim("realm_access", Map.of("roles", roles))
                .build();
    }

    @Test
    void adminRole_mapsToROLE_admin() {
        var token = converter.convert(jwtWithRoles(List.of("admin")));
        assertThat(token.getAuthorities())
                .extracting(GrantedAuthority::getAuthority)
                .containsExactly("ROLE_admin");
    }

    @Test
    void memberRole_mapsToROLE_member() {
        var token = converter.convert(jwtWithRoles(List.of("member")));
        assertThat(token.getAuthorities())
                .extracting(GrantedAuthority::getAuthority)
                .containsExactly("ROLE_member");
    }

    @Test
    void multipleRoles_allMapped() {
        var token = converter.convert(jwtWithRoles(List.of("admin", "member")));
        assertThat(token.getAuthorities())
                .extracting(GrantedAuthority::getAuthority)
                .containsExactlyInAnyOrder("ROLE_admin", "ROLE_member");
    }

    @Test
    void noRealmAccess_returnsEmptyAuthorities() {
        Jwt jwt = Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .claim("sub", "test-user")
                .build();
        var token = converter.convert(jwt);
        assertThat(token.getAuthorities()).isEmpty();
    }

    @Test
    void emptyRoles_returnsEmptyAuthorities() {
        var token = converter.convert(jwtWithRoles(List.of()));
        assertThat(token.getAuthorities()).isEmpty();
    }
}
