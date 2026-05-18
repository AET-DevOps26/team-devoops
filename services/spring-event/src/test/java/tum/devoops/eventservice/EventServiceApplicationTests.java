package tum.devoops.eventservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

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
class EventServiceApplicationTests {

    @Test
    void contextLoads() {
    }

}
