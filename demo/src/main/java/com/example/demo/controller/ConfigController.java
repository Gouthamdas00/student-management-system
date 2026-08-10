package com.example.demo.controller;

import com.example.demo.dto.FormConfigDTO;
import com.example.demo.services.ConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private final ConfigService configService;

    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }

    @GetMapping
    public ResponseEntity<FormConfigDTO> getConfig() {
        return ResponseEntity.ok(configService.getConfig());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FormConfigDTO> updateConfig(@RequestBody FormConfigDTO config) {
        return ResponseEntity.ok(configService.updateConfig(config));
    }
}