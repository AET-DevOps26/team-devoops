package tum.devoops.organizationservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/organization/hello")
    public String hello() {
        return "Hello world from organization-service!";
    }

}
