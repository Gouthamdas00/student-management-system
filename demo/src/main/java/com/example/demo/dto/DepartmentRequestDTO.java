package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DepartmentRequestDTO {
    @NotBlank(message = "Department name is required")
    @Pattern(regexp = "^[a-zA-Z\\s&]+$", message = "Department name cannot contain numbers")
    private String name;
    @NotBlank(message = "Head of Department is required")
    @Pattern(regexp = "^[a-zA-Z\\s.]+$", message = "HOD name cannot contain numbers or special characters")
    private String headOfDepartment;
    
}
