package com.example.demo.Exception;

public class StudentNotFound extends RuntimeException {
    public StudentNotFound(String message) {
        super(message);
    }
    
}
