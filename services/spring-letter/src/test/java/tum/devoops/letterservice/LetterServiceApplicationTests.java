package tum.devoops.letterservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import tum.devoops.letterservice.repository.DirectorRepository;
import tum.devoops.letterservice.repository.MemberRepository;
import tum.devoops.letterservice.repository.SportRepository;
import tum.devoops.letterservice.repository.TeamRepository;
import tum.devoops.letterservice.repository.TraineeRepository;
import tum.devoops.letterservice.repository.TrainerRepository;
import tum.devoops.letterservice.repository.TransactionRepository;

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
class LetterServiceApplicationTests {

    @MockitoBean MemberRepository memberRepository;
    @MockitoBean SportRepository sportRepository;
    @MockitoBean TeamRepository teamRepository;
    @MockitoBean DirectorRepository directorRepository;
    @MockitoBean TrainerRepository trainerRepository;
    @MockitoBean TraineeRepository traineeRepository;
    @MockitoBean TransactionRepository transactionRepository;

    @Test
    void contextLoads() {
    }

}
