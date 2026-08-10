package com.example.demo.mapper;

import com.example.demo.dto.DepartmentRequestDTO;
import com.example.demo.dto.DepartmentResponseDTO;
import com.example.demo.model.Department;

public class DepartmentMapper {
    public static DepartmentResponseDTO mapToResponseDTO(Department department) {
       int studentCount = (department.getStudents() != null) ? department.getStudents().size() : 0;
        return new DepartmentResponseDTO(
                department.getId(),
                department.getName(),
                department.getHeadOfDepartment(),
                studentCount
        );
    }
    public static Department mapToEntity(DepartmentRequestDTO requestDTO) {
        Department department = new Department();
        department.setName(requestDTO.getName());
        department.setHeadOfDepartment(requestDTO.getHeadOfDepartment());
        return department;
    }
}
