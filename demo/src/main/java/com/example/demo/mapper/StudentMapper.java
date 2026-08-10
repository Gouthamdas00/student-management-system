package com.example.demo.mapper;

import com.example.demo.dto.StudentRequestDTO;
import com.example.demo.dto.StudentResponseDTO;
import com.example.demo.model.Department;
import com.example.demo.model.Students;

public class StudentMapper {

    public static Students mapToEntity(StudentRequestDTO requestDTO, Department department) {
        Students student = new Students();
        student.setName(requestDTO.getName());
        student.setMarks(requestDTO.getMarks());
        student.setSemester(requestDTO.getSemester());
        student.setDepartment(department);
        
        return student;
    }

    public static StudentResponseDTO mapToResponseDTO(Students student) {
        String deptName = "Unassigned";
        Long deptId = null;

        if (student.getDepartment() != null) {
            deptName = student.getDepartment().getName();
            deptId = student.getDepartment().getId(); // Extract department ID
        }

        // Pass all 6 fields to populate departmentId in the JSON response
        return new StudentResponseDTO(
                student.getRollNumber(),
                student.getName(),
                student.getMarks(),
                student.getSemester(),
                deptName,
                deptId
        );
    }
}