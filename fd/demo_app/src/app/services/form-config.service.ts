import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface StudentFormConfig {
  minMarks: number;
  maxMarks: number;
  minSemester: number;
  maxSemester: number;
}

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/config'; // Spring Boot endpoint

  private defaultConfig: StudentFormConfig = {
    minMarks: 0,
    maxMarks: 100,
    minSemester: 1,
    maxSemester: 8
  };

  // Reactive Signal holding the active form rules
  studentConfig = signal<StudentFormConfig>(this.defaultConfig);

  constructor() {
    this.fetchConfig();
  }

  // Fetch rules from Spring Boot database on app initialization
  fetchConfig(): void {
    this.http.get<StudentFormConfig>(this.apiUrl).subscribe({
      next: (config) => {
        this.studentConfig.set(config);
      },
      error: (err) => {
        console.error('Failed to fetch form rules from backend. Falling back to defaults.', err);
      }
    });
  }

  // Persist updated rules to Spring Boot database
  saveStudentConfig(newConfig: StudentFormConfig): void {
    this.http.post<StudentFormConfig>(this.apiUrl, newConfig).subscribe({
      next: (updatedConfig) => {
        this.studentConfig.set(updatedConfig);
      },
      error: (err) => {
        console.error('Failed to save updated rules to backend:', err);
      }
    });
  }

  // Reset rules back to system defaults
  resetToDefault(): void {
    this.saveStudentConfig(this.defaultConfig);
  }
}