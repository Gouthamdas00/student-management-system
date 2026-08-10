package com.example.demo.services;

import com.example.demo.model.Department;
import com.example.demo.model.Staff;
import com.example.demo.repository.Departmentrepo;
import com.example.demo.repository.Staffrepo;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class Staffservice {

    private final Staffrepo staffrepo;
    private final Departmentrepo departmentrepo;

    public Staffservice(Staffrepo staffrepo, Departmentrepo departmentrepo) {
        this.staffrepo = staffrepo;
        this.departmentrepo = departmentrepo;
    }

    public List<Staff> getStaffByDepartment(Long departmentId) {
        return staffrepo.findByDepartmentId(departmentId);
    }

    @Transactional
    public Staff addStaffManually(Long departmentId, Staff staff) {
        Department department = departmentrepo.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + departmentId));
        staff.setDepartment(department);
        return staffrepo.save(staff);
    }

    @Transactional
    public List<Staff> importStaffFromExcel(Long departmentId, MultipartFile file) {
        Department department = departmentrepo.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + departmentId));

        List<Staff> staffList = new ArrayList<>();

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            // Skip header row (row 0) and iterate
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String name = getCellValueAsString(row.getCell(0));
                String subject = getCellValueAsString(row.getCell(1));
                String designation = getCellValueAsString(row.getCell(2));
                String email = getCellValueAsString(row.getCell(3));

                if (name != null && !name.trim().isEmpty()) {
                    Staff staff = new Staff(name, subject, designation, email, department);
                    staffList.add(staff);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }

        return staffrepo.saveAll(staffList);
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            default -> "";
        };
    }
    @Transactional
public void deleteStaff(Long id) {
    staffrepo.deleteById(id);
}
@Transactional
public Staff updateStaff(Long id, Staff staffDetails) {
    Staff existingStaff = staffrepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Staff member not found with ID: " + id));

    existingStaff.setName(staffDetails.getName());
    existingStaff.setDesignation(staffDetails.getDesignation());
    existingStaff.setSubject(staffDetails.getSubject());
    existingStaff.setEmail(staffDetails.getEmail());

    return staffrepo.save(existingStaff);
}
}