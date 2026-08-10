package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormConfigDTO {
    private Integer minSemester = 1;
    private Integer maxSemester = 8;
    private Integer minMarks = 0;
    private Integer maxMarks = 100;
}