package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class DemoController {
    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is the PUBLIC endpoint. Anyone can see this.";
    }

    @GetMapping("/private")
    public String privateEndpoint() {
        return "You are viewing the PRIVATE endpoint because you are authenticated.";
    }
    
}
