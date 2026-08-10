package com.example.demo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentResponseDTO {
    private Long id;
    private String name;
    private String headOfDepartment;
    private Integer studentCount; 
}
