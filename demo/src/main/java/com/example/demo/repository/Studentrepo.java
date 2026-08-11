package com.example.demo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Students;

public interface Studentrepo extends JpaRepository<Students, Long> {

    @Query("SELECT s FROM Students s WHERE s.semester = :semester")
    Page<Students> getBySem(@Param("semester") int semester, Pageable pageable);

    @Modifying
    @Query("UPDATE Students s SET s.marks = :newMarks WHERE s.rollNumber = :rollNo")
    void updateByRN(@Param("rollNo") Long rollNo, @Param("newMarks") int newMarks);

    @Modifying
    @Query("DELETE FROM Students s WHERE s.rollNumber = :r")
    void deleteByRN(@Param("r") Long r);

    @Query("SELECT COUNT(s) > 0 FROM Students s WHERE s.department.id = :deptId")
    boolean existsByDepartmentId(@Param("deptId") Long deptId);

    List<Students> findAllByOrderByNameAsc();
    long countByDepartmentId(Long departmentId);

    @Modifying
    @Query(value = "UPDATE students SET roll_number = :newRoll WHERE roll_number = :targetRoll", nativeQuery = true)
    void updateRollNumberNative(@Param("targetRoll") Long targetRoll, @Param("newRoll") Long newRoll);
}