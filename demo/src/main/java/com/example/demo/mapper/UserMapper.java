package com.example.demo.mapper;

import com.example.demo.model.AuthReq;
import com.example.demo.model.Users;

public class UserMapper {
    public static Users mapToUser(AuthReq authReq) {
        Users user = new Users();
        user.setUsername(authReq.getUsername());
        user.setPassword(authReq.getPassword());
        return user;
    }
}
