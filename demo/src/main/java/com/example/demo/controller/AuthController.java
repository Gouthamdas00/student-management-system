package com.example.demo.controller;

import com.example.demo.dto.AuthResponseDTO;
import com.example.demo.dto.LoginRequestDTO;
import com.example.demo.dto.RegisterRequestDTO;
import com.example.demo.model.Users;
import com.example.demo.services.JWTservice;
import com.example.demo.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JWTservice jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JWTservice jwtService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) {
        userService.registerUser(request);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

@PostMapping("/login")
public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
    );

    if (authentication.isAuthenticated()) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        // Extract the primary role from userDetails
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        // Pass token, username, AND role to the response DTO
        return ResponseEntity.ok(new AuthResponseDTO(token, userDetails.getUsername(), role));
    }

    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
}
}
