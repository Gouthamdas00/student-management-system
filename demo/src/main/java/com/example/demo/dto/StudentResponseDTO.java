package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponseDTO {
    
    // 5-parameter constructor for legacy calls
    public StudentResponseDTO(Long rollNumber, String name, double marks, int semester, String departmentName) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.marks = marks;
        this.semester = semester;
        this.departmentName = departmentName;
    }
    
    private Long rollNumber;
    private String name;
    private double marks;
    private int semester;
    private String departmentName;
    private Long departmentId;
}