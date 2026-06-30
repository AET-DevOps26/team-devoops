package tum.devoops.memberservice.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @PreAuthorize("hasRole('member')")
    @GetMapping("/members/hello")
    public String hello() {
        return "Hello world from member-service!";
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/members/helloAdmin")
    public String helloAdmin() {
        return "Hello world to admin from member-service!";
    }

}
