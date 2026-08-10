package com.example.demo.dto;

public class RegisterRequestDTO {
    
    private String username;
    private String password;
    private String roleName; 

    // Explicit Getters and Setters - No Lombok needed!
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}