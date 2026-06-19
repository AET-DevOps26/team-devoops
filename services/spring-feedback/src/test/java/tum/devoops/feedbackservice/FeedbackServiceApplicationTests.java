package tum.devoops.feedbackservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import tum.devoops.feedbackservice.service.FeedbackService;

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
class FeedbackServiceApplicationTests {

    @MockitoBean
    private FeedbackService feedbackService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void contextLoads() {
    }

}
