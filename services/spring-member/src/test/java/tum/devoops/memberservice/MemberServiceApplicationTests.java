package tum.devoops.memberservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import tum.devoops.memberservice.service.MemberService;

/**
 * Context-load smoke test.
 *
 * DataSource and JPA auto-configurations are excluded so the test can run
 * without a live PostgreSQL instance.
 *
 * MemberService is mocked (it depends on the JPA repository, which is not
 * created without a DataSource), but KeycloakService is deliberately left real:
 * its constructor resolves the {@code keycloak.base-url} / {@code keycloak.realm}
 * placeholders at startup, so this test fails fast if that config is missing —
 * which is exactly the deployment failure this guards against.
 */
@SpringBootTest(properties = {
        "spring.autoconfigure.exclude=" +
                "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration," +
                "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration"
})
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=none"
})
class MemberServiceApplicationTests {

    @MockitoBean
    private MemberService memberService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void contextLoads() {
    }

}
