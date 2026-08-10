package com.example.demo.services;

import com.example.demo.Exception.DepartmentNotFound;
import com.example.demo.Exception.StudentNotFound;
import com.example.demo.dto.StudentRequestDTO;
import com.example.demo.dto.StudentResponseDTO;
import com.example.demo.model.Department;
import com.example.demo.model.Students;
import com.example.demo.repository.Departmentrepo;
import com.example.demo.repository.Studentrepo;
import com.example.demo.mapper.StudentMapper;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Studentservice {
    private final Departmentrepo departmentrepo;
    private final Studentrepo studentrepo;
    private final ConfigService configService;

    public Studentservice(Studentrepo studentrepo, Departmentrepo departmentrepo, ConfigService configService) {
        this.studentrepo = studentrepo;
        this.departmentrepo = departmentrepo;
        this.configService = configService;
    }

    public Page<StudentResponseDTO> getAllStudents(Pageable pageable) {
        return studentrepo.findAll(pageable)
                .map(StudentMapper::mapToResponseDTO); 
    }

    public StudentResponseDTO getStudentRN(Long rollNumber) {
        Students student = studentrepo.findById(rollNumber)
                .orElseThrow(() -> new StudentNotFound("Student not found with roll number: " + rollNumber));
        return StudentMapper.mapToResponseDTO(student);
    }

    @Transactional
    public StudentResponseDTO addStudent(StudentRequestDTO studentDTO) {
        configService.validateStudentRules(studentDTO);
        Department department = departmentrepo.findById(studentDTO.getDepartmentId())
                .orElseThrow(() -> new DepartmentNotFound("Department not found with id: " + studentDTO.getDepartmentId()));

        Students newStudent = StudentMapper.mapToEntity(studentDTO, department);
        Students savedStudent = studentrepo.save(newStudent);
        return StudentMapper.mapToResponseDTO(savedStudent);
    }

    @Transactional
    public StudentResponseDTO updateStudent(Long rollNumber, StudentRequestDTO dto) {
        Students existingStudent = studentrepo.findById(rollNumber)
               .orElseThrow(() -> new RuntimeException("Student not found with roll number: " + rollNumber));
     
        Department department = departmentrepo.findById(dto.getDepartmentId())
                 .orElseThrow(() -> new RuntimeException("Department not found with ID: " + dto.getDepartmentId()));

        existingStudent.setName(dto.getName());
        existingStudent.setMarks(dto.getMarks());
        existingStudent.setSemester(dto.getSemester());
        existingStudent.setDepartment(department);
     
        Students savedStudent = studentrepo.save(existingStudent);
        return StudentMapper.mapToResponseDTO(savedStudent);
    }

    public Page<StudentResponseDTO> getBySem(int semester, Pageable pageable){
        return studentrepo.getBySem(semester, pageable)
                .map(StudentMapper::mapToResponseDTO);
    }

    @Transactional
    public void updateMarks(Long rollNumber, int marks ){
        studentrepo.updateByRN(rollNumber, marks);
    }

    @Transactional
    public void deleteByRN(Long r){
        studentrepo.deleteByRN(r);
    }

    public Page<StudentResponseDTO> getPaginatedStudents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "rollNumber"));
        return studentrepo.findAll(pageable)
                .map(StudentMapper::mapToResponseDTO);
    }

    @Transactional
    public void reassignRollNumbersAlphabetically() {
        List<Students> students = studentrepo.findAllByOrderByNameAsc();

        if (students.isEmpty()) {
            return;
        }

        // Phase 1: Set temporary negative roll numbers using getRollNumber()
        for (int i = 0; i < students.size(); i++) {
            Long currentRoll = students.get(i).getRollNumber();
            studentrepo.updateRollNumberNative(currentRoll, (long) -(i + 1));
        }

        // Phase 2: Set final positive sequential roll numbers starting from 1
        for (int i = 0; i < students.size(); i++) {
            Long tempRoll = (long) -(i + 1);
            studentrepo.updateRollNumberNative(tempRoll, (long) (i + 1));
        }
    }
}