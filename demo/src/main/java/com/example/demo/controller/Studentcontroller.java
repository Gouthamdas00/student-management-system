package com.example.demo.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.StudentRequestDTO;
import com.example.demo.dto.StudentResponseDTO;
import com.example.demo.services.Studentservice;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/private/students") // <-- 1. Base path for all student endpoints
public class Studentcontroller {
    
    private final Studentservice students;

    public Studentcontroller(Studentservice students) {
        this.students = students;
    }
    
    // GET /private/students?page=0&size=10&sortBy=rollNumber
    @GetMapping
    public ResponseEntity<Page<StudentResponseDTO>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rollNumber") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));      
        return ResponseEntity.ok(students.getAllStudents(pageable));
    }

    // GET /private/students/123
    @GetMapping("/{rollNumber}")
    public ResponseEntity<StudentResponseDTO> studentByRN(@PathVariable Long rollNumber){
        StudentResponseDTO responseDTO = students.getStudentRN(rollNumber);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
    
    // GET /private/students/semester/5
    @GetMapping("/semester/{semester}")
    public ResponseEntity<Page<StudentResponseDTO>> getBySem(
            @PathVariable int semester,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
            
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(students.getBySem(semester, pageable));
    }
    
    // POST /private/students
    @PostMapping
    @PreAuthorize("hasAuthority('STUDENT_WRITE')")
    public ResponseEntity<StudentResponseDTO> addStudent(@Valid @RequestBody StudentRequestDTO studentRequestDTO){
        System.out.println("CURRENT USER AUTHORITIES: " + 
        SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        StudentResponseDTO createdStudent = students.addStudent(studentRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
    }
   
    // PUT /private/students/123
    @PutMapping("/{rollNumber}")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable Long rollNumber, 
            @Valid @RequestBody StudentRequestDTO studentDTO){
            
        StudentResponseDTO updatedStudent = students.updateStudent(rollNumber, studentDTO);
        return ResponseEntity.ok(updatedStudent);
    }

    // PUT /private/students/123/marks
    @PutMapping("/{rollNumber}/marks")
    public ResponseEntity<Void> updateMarks(@PathVariable Long rollNumber, @RequestParam("marks") int mark ){
        students.updateMarks(rollNumber, mark);
        return ResponseEntity.ok().build();
    }

    // DELETE /private/students/123
    @DeleteMapping("/{rollNumber}")
    @PreAuthorize("hasAuthority('STUDENT_DELETE')")
    public ResponseEntity<Void> deleteByRN(@PathVariable Long rollNumber){
        students.deleteByRN(rollNumber);
        return ResponseEntity.noContent().build(); 
    }
@PutMapping("/reassign-roll-numbers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> reassignRollNumbers() {
        students.reassignRollNumbersAlphabetically();
        return ResponseEntity.ok(Map.of("message", "Roll numbers reassigned alphabetically."));
    }

//     @GetMapping
//     public ResponseEntity<Page<StudentResponseDTO>> getAllStudents(
//         @RequestParam(defaultValue = "0") int page,
//         @RequestParam(defaultValue = "5") int size) {
    
//         return ResponseEntity.ok(students.getPaginatedStudents(page, size));
// }
}