package com.example.demo.services;

import com.example.demo.Exception.DepartmentNotFound;
import com.example.demo.dto.DepartmentRequestDTO;
import com.example.demo.dto.DepartmentResponseDTO;
import com.example.demo.dto.StudentResponseDTO;
import com.example.demo.mapper.DepartmentMapper;
import com.example.demo.model.Department;
import com.example.demo.repository.Departmentrepo;
import com.example.demo.repository.Studentrepo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Departmentservice {

    private final Departmentrepo departmentrepo;
    private final Studentrepo studentrepo;

    public Departmentservice(Departmentrepo departmentrepo, Studentrepo studentrepo) {
        this.departmentrepo = departmentrepo;
        this.studentrepo = studentrepo;
    }

    // ==========================================
    // 1. Get Students by Department ID
    // ==========================================
    @Transactional(readOnly = true)
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

    // ==========================================
    // 2. Create Department
    // ==========================================
    @Transactional
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO requestDTO) {
        Department department = DepartmentMapper.mapToEntity(requestDTO);
        Department savedDepartment = departmentrepo.save(department);
        return convertToDTO(savedDepartment);
    }

    // ==========================================
    // 3. Get Single Department
    // ==========================================
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartment(Long id) {
        Department department = departmentrepo.findById(id)
                .orElseThrow(() -> new DepartmentNotFound("Department not found with id: " + id));
        return convertToDTO(department);
    }

    // ==========================================
    // 4. Get All Departments (Unpaginated)
    // ==========================================
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getAllDepartments() {
        return departmentrepo.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ==========================================
    // 5. Get Paginated Departments
    // ==========================================
    @Transactional(readOnly = true)
    public Page<DepartmentResponseDTO> getPaginatedDepartments(Pageable pageable) {
    // ==========================================================================
    // [NEW FIX] Check if the requested sort parameter is 'studentCount'
    // ==========================================================================
    Sort.Order studentCountOrder = pageable.getSort().getOrderFor("studentCount");

    if (studentCountOrder != null) {
        Pageable cleanPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        
        if (studentCountOrder.isDescending()) {
            return departmentrepo.findAllOrderByStudentCountDesc(cleanPageable).map(this::convertToDTO);
        } else {
            return departmentrepo.findAllOrderByStudentCountAsc(cleanPageable).map(this::convertToDTO);
        }
    }

    // Default JPA sorting for entity fields (e.g. name, id)
    return departmentrepo.findAll(pageable).map(this::convertToDTO);
}

    // ==========================================
    // 6. Update Department
    // ==========================================
    @Transactional
    public DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO requestDTO) {
        Department department = departmentrepo.findById(id)
            .orElseThrow(() -> new DepartmentNotFound("Department not found with id: " + id));

        department.setName(requestDTO.getName());
        department.setHeadOfDepartment(requestDTO.getHeadOfDepartment());

        Department savedDepartment = departmentrepo.save(department);
        return convertToDTO(savedDepartment);
    }

    // ==========================================
    // 7. Delete Department
    // ==========================================
    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentrepo.findById(id)
                .orElseThrow(() -> new DepartmentNotFound("Department not found with ID: " + id));

        // Prevent deletion if active students exist
        if (studentrepo.existsByDepartmentId(id)) {
            throw new IllegalStateException("Cannot delete department with active students assigned.");
        }

        departmentrepo.delete(department);
    }

    // ==========================================
    // Helper: Convert Entity -> DTO with Student Count
    // ==========================================
    public DepartmentResponseDTO convertToDTO(Department department) {
        DepartmentResponseDTO dto = new DepartmentResponseDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setHeadOfDepartment(department.getHeadOfDepartment());

        // [NEW FIX] Calculate and map total student count dynamically for Angular
        if (department.getStudents() != null && !department.getStudents().isEmpty()) {
            dto.setStudentCount(department.getStudents().size());
        } else if (department.getId() != null) {
            dto.setStudentCount((int) studentrepo.countByDepartmentId(department.getId()));
        } else {
            dto.setStudentCount(0);
        }

        return dto;
    }

    public List<DepartmentResponseDTO> getStudentCount() {
        return departmentrepo.findAllWithStudentCount();
    }
}