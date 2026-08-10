package com.example.demo.controller;

import com.example.demo.model.Staff;
import com.example.demo.services.Staffservice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/private/staff")
public class StaffController {

    private final Staffservice staffservice;

    public StaffController(Staffservice staffservice) {
        this.staffservice = staffservice;
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Staff>> getStaffByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(staffservice.getStaffByDepartment(departmentId));
    }

    @PostMapping("/department/{departmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Staff> addStaffManually(@PathVariable Long departmentId, @RequestBody Staff staff) {
        return ResponseEntity.ok(staffservice.addStaffManually(departmentId, staff));
    }

    @PostMapping("/department/{departmentId}/upload-excel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Staff>> uploadStaffExcel(
            @PathVariable Long departmentId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(staffservice.importStaffFromExcel(departmentId, file));
    }
    // DELETE /private/staff/1
@DeleteMapping("/{id}")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
    staffservice.deleteStaff(id);
    return ResponseEntity.noContent().build();
}
// PUT /private/staff/1
@PutMapping("/{id}")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @RequestBody Staff staff) {
    return ResponseEntity.ok(staffservice.updateStaff(id, staff));
}
}