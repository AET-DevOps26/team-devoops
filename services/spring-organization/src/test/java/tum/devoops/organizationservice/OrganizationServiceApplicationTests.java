package tum.devoops.organizationservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import tum.devoops.organizationservice.service.OrganizationSportService;
import tum.devoops.organizationservice.service.OrganizationTeamService;

/**
 * Context-load smoke test.
 *
 * DataSource and JPA auto-configurations are excluded so the test can run
 * without a live PostgreSQL instance.
 */
@SpringBootTest(properties = {
        "spring.autoconfigure.exclude=" +
                "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration," +
                "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration"
})
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=none"
})
class OrganizationServiceApplicationTests {

    @MockitoBean
    private OrganizationSportService sportService;

    @MockitoBean
    private OrganizationTeamService teamService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void contextLoads() {
    }

}
