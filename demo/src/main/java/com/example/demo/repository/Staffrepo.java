package com.example.demo.repository;

import com.example.demo.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface Staffrepo extends JpaRepository<Staff, Long> {
    List<Staff> findByDepartmentId(Long departmentId);
}