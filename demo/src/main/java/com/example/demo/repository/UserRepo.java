package com.example.demo.repository;

import com.example.demo.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepo extends JpaRepository<Users, Integer> {
    Users findByUsername(String username);
    boolean existsByUsername(String username);
}