package com.example.demo.controller;

import com.example.demo.dto.DepartmentRequestDTO;
import com.example.demo.dto.DepartmentResponseDTO;
import com.example.demo.dto.StudentResponseDTO;
import com.example.demo.services.Departmentservice;

import jakarta.validation.Valid;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/private/departments")
public class Departmentcontroller {

    private final Departmentservice departmentservice;

    Departmentcontroller(Departmentservice departmentservice) {
        this.departmentservice = departmentservice;
    }

    // ADDED: Fetch all departments
    @GetMapping
    public ResponseEntity<?> getAllDepartments(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false, defaultValue = "id,asc") String sort) {

        // If page & size parameters are supplied by Angular, return Paginated & Sorted Page object
        if (page != null && size != null) {

            // [NEW FIX] Parse "name,asc" or "studentCount,desc" sent from Angular
            String[] sortParts = sort.split(",");
            String sortProperty = sortParts[0];
            Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortProperty));

            return ResponseEntity.ok(departmentservice.getPaginatedDepartments(pageable));
        }

        // Unpaginated fallback (for dropdowns / summaries)
        return ResponseEntity.ok(departmentservice.getAllDepartments());
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<StudentResponseDTO>> getStudentsByDepartment(@PathVariable Long id) {
        List<StudentResponseDTO> responseDTO = departmentservice.getDepartmentById(id);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<DepartmentResponseDTO> createDepartment(@RequestBody DepartmentRequestDTO requestDTO) {
        DepartmentResponseDTO responseDTO = departmentservice.createDepartment(requestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public DepartmentResponseDTO getDepartmentById(@PathVariable Long id) {
        return departmentservice.getDepartment(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentResponseDTO> updateDepartment(
    @PathVariable Long id,
    @Valid @RequestBody DepartmentRequestDTO requestDTO) {
        DepartmentResponseDTO updatedDepartment = departmentservice.updateDepartment(id, requestDTO);
        return ResponseEntity.ok(updatedDepartment);
    }
    // @GetMapping
    // public ResponseEntity<Page<DepartmentResponseDTO>> getAllDepartments(
    //     @RequestParam(defaultValue = "0") int page,
    //     @RequestParam(defaultValue = "5") int size) {
    
    // return ResponseEntity.ok(departmentservice.getPaginatedDepartments(page, size));
    // }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
    departmentservice.deleteDepartment(id);
    return ResponseEntity.noContent().build(); // Returns HTTP 204 No Content
}
}