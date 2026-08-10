package com.example.demo.services;

import com.example.demo.dto.FormConfigDTO;
import com.example.demo.dto.StudentRequestDTO;
import org.springframework.stereotype.Service;

@Service
public class ConfigService {

    // Default configuration (can also be saved to DB)
    private FormConfigDTO currentConfig = new FormConfigDTO(1, 8, 0, 100);

    public FormConfigDTO getConfig() {
        return currentConfig;
    }

    public FormConfigDTO updateConfig(FormConfigDTO newConfig) {
        this.currentConfig = newConfig;
        return this.currentConfig;
    }

    // Dynamic validation logic
    public void validateStudentRules(StudentRequestDTO student) {
        if (student.getSemester() < currentConfig.getMinSemester() || student.getSemester() > currentConfig.getMaxSemester()) {
            throw new IllegalArgumentException(
                String.format("Semester must be between %d and %d", currentConfig.getMinSemester(), currentConfig.getMaxSemester())
            );
        }

        if (student.getMarks() < currentConfig.getMinMarks() || student.getMarks() > currentConfig.getMaxMarks()) {
            throw new IllegalArgumentException(
                String.format("Marks must be between %d and %d", currentConfig.getMinMarks(), currentConfig.getMaxMarks())
            );
        }
    }
}