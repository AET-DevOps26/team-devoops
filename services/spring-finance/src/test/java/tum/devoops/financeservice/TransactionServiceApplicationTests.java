package tum.devoops.financeservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import tum.devoops.financeservice.repository.DirectorRepository;
import tum.devoops.financeservice.repository.MemberRepository;
import tum.devoops.financeservice.repository.TeamRepository;
import tum.devoops.financeservice.repository.TrainerRepository;
import tum.devoops.financeservice.repository.TransactionRepository;

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
class TransactionServiceApplicationTests {

    @MockBean TransactionRepository transactionRepository;
    @MockBean MemberRepository memberRepository;
    @MockBean DirectorRepository directorRepository;
    @MockBean TeamRepository teamRepository;
    @MockBean TrainerRepository trainerRepository;

    @Test
    void contextLoads() {
    }

}
