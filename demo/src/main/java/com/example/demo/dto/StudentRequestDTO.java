package com.example.demo.dto;

//import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequestDTO {
    
    
    
    @NotBlank(message = "Student name is required")
    @Pattern(regexp = "^[a-zA-Z\\s.]+$", message = "Student name cannot contain numbers or special characters")
    @Size(min = 2, max = 50, message = "Student name must be between 2 and 50 characters")
    private String name;
    
    @NotNull
    //@Max(100)
    private int marks;
    
    @NotNull
    private int semester;
    
    @NotNull(message = "Department ID is required")
    private Long departmentId;
}