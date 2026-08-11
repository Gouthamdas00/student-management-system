package com.example.demo.services;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.RegisterRequestDTO;
import com.example.demo.model.Users;
import com.example.demo.model.Role;
import com.example.demo.repository.UserRepo;

@Service
public class UserService {
    private final UserRepo userRepo;

    UserService(UserRepo userRepo, AuthenticationManager authManager, JWTservice jwtService) {
        this.userRepo = userRepo;
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    private final AuthenticationManager authManager;
    private JWTservice jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Users registerUser(RegisterRequestDTO request) {
        if (userRepo.existsByUsername(request.getUsername())) {
        throw new RuntimeException("Username '" + request.getUsername() + "' is already taken.");
        }
        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        Role assignedRole = Role.valueOf(request.getRoleName());
        user.setRole(assignedRole);
        
        return userRepo.save(user);
    }
    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepo.save(user);
    }
    public String verify(Users user) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if(authentication.isAuthenticated()){

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return jwtService.generateToken(userDetails);
        }
        else{
            return "Failure";
        }
    }
}
