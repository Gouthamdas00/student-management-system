package com.example.demo.Exception;

public class DepartmentNotFound extends RuntimeException {
    public DepartmentNotFound(String message) {
        super(message);
    }
    
}
