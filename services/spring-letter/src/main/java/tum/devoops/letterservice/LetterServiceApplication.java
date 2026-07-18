package tum.devoops.letterservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class LetterServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LetterServiceApplication.class, args);
    }

}
