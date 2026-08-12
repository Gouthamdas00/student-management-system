package com.example.demo.repository;

import com.example.demo.dto.DepartmentResponseDTO;
import com.example.demo.model.Department;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;


public interface Departmentrepo extends JpaRepository<Department, Long> {

    @Query("SELECT new com.example.demo.dto.DepartmentResponseDTO(" +
           "d.id, d.name, d.headOfDepartment, CAST(COUNT(s) AS int)) " +
           "FROM Department d LEFT JOIN d.students s " +
           "GROUP BY d.id, d.name, d.headOfDepartment")
    List<DepartmentResponseDTO> findAllWithStudentCount();

    @Query(value = "SELECT d FROM Department d LEFT JOIN d.students s GROUP BY d.id ORDER BY COUNT(s) DESC",
           countQuery = "SELECT COUNT(d) FROM Department d")
    Page<Department> findAllOrderByStudentCountDesc(Pageable pageable);

    @Query(value = "SELECT d FROM Department d LEFT JOIN d.students s GROUP BY d.id ORDER BY COUNT(s) ASC",
           countQuery = "SELECT COUNT(d) FROM Department d")
    Page<Department> findAllOrderByStudentCountAsc(Pageable pageable);
}