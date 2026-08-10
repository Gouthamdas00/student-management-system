package com.example.demo.services;

import com.example.demo.Exception.DepartmentNotFound;
import com.example.demo.dto.DepartmentRequestDTO;
import com.example.demo.dto.DepartmentResponseDTO;
import com.example.demo.dto.StudentResponseDTO;
import com.example.demo.mapper.DepartmentMapper;
import com.example.demo.model.Department;
import com.example.demo.repository.Departmentrepo;
import com.example.demo.repository.Studentrepo;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Departmentservice {

    private final Departmentrepo departmentrepo;
    private final Studentrepo studentrepo;
    

    Departmentservice(Departmentrepo departmentrepo, Studentrepo studentrepo) {
        this.departmentrepo = departmentrepo;
        this.studentrepo = studentrepo;
    }

    public List<StudentResponseDTO> getDepartmentById(Long id) {
        Department department = departmentrepo.findById(id)
                .orElseThrow(() -> new DepartmentNotFound("Department not found with id: " + id));
        
        return department.getStudents().stream()
                .map(student -> new StudentResponseDTO(
                        student.getRollNumber(),
                        student.getName(),
                        student.getMarks(),
                        student.getSemester(),
                        department.getName()
                ))
                .collect(Collectors.toList());
    }
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO requestDTO) {
        Department department = DepartmentMapper.mapToEntity(requestDTO);
        Department saveddepartment = departmentrepo.save(department);
        return DepartmentMapper.mapToResponseDTO(saveddepartment);
    }
        public DepartmentResponseDTO getDepartment(Long id) {
        Department department = departmentrepo.findById(id)
                .orElseThrow(() -> new DepartmentNotFound("Department not found with id: " + id));
        return DepartmentMapper.mapToResponseDTO(department);
    }
    @Transactional
    public List<DepartmentResponseDTO> getAllDepartments() {
        return departmentrepo.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(DepartmentMapper::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    private DepartmentResponseDTO convertToDTO(Department department) {
        DepartmentResponseDTO dto = new DepartmentResponseDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        // Map any other fields your DepartmentResponseDTO has (e.g., code, description, etc.)
        return dto;
    }
    public List<DepartmentResponseDTO> getStudentCount() {
        return departmentrepo.findAllWithStudentCount();
    }
    @Transactional
    public DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO requestDTO) {
        Department department = departmentrepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        department.setName(requestDTO.getName());
        department.setHeadOfDepartment(requestDTO.getHeadOfDepartment());

        Department savedDepartment = departmentrepo.save(department);
        return DepartmentMapper.mapToResponseDTO(savedDepartment);
}
    public Page<DepartmentResponseDTO> getPaginatedDepartments(int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));
    return departmentrepo.findAll(pageable)
            .map(DepartmentMapper::mapToResponseDTO);
}
    @Transactional
public void deleteDepartment(Long id) {
    Department department = departmentrepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));

    // Check if students exist in this department
    if (studentrepo.existsByDepartmentId(id)) {
        throw new RuntimeException("Cannot delete department with active students assigned.");
    }

    departmentrepo.delete(department);
}
}