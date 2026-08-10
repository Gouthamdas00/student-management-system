package com.example.demo.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.demo.model.Users;
import com.example.demo.services.UserService;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class UserController {
    
    private final UserService userService;

    UserController(UserService userService) {
        this.userService = userService;
    }

    // @PostMapping("/public/register")
    // public Users register(@RequestBody Users user) {
    //     return userService.register(user);
    // }

    @PostMapping("/public/login")
    public String login(@RequestBody Users user) {
        return userService.verify(user);
    }
}
