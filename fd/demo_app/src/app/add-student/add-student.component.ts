import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DataService } from '../services/data.service';
import { FormConfigService } from '../services/form-config.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent implements OnInit {
  private toastService = inject(ToastService);
  private dataService = inject(DataService);
  private configService = inject(FormConfigService);
  private router = inject(Router);

  studentData = {
    name: '',
    departmentId: '',
    semester: null as number | null,
    marks: null as number | null
  };

  departments: any[] = [];
  isSubmitting = false;

  // Error state properties for UI feedback
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};

  config = this.configService.studentConfig;

  ngOnInit(): void {
    this.fetchDepartments();
  }

fetchDepartments(): void {
    this.dataService.getDepartments().subscribe({
      next: (res: any) => {
        this.departments = Array.isArray(res) ? res : (res?.content || []);
      },
      error: (err) => {
        console.error('Failed to load departments for dropdown', err);
        // Toast on fetch error
        this.toastService.show('Failed to load departments dropdown', 'error');
      }
    });
  }

  onSubmit(studentForm: NgForm): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    // 1. Mark all controls touched to trigger UI highlights
    studentForm.control.markAllAsTouched();

    // 2. Validate Empty Fields
    if (!this.studentData.name || !this.studentData.name.trim()) {
      this.fieldErrors['name'] = 'Student full name is required';
    }

    if (!this.studentData.departmentId) {
      this.fieldErrors['departmentId'] = 'Please select a department';
    }

    if (this.studentData.semester === null || this.studentData.semester === undefined) {
      this.fieldErrors['semester'] = 'Semester is required';
    }

    if (this.studentData.marks === null || this.studentData.marks === undefined) {
      this.fieldErrors['marks'] = 'Marks are required';
    }

    // 3. Name Validation (Numbers Check)
    if (this.studentData.name && !/^[a-zA-Z\s.]+$/.test(this.studentData.name.trim())) {
      this.fieldErrors['name'] = 'numbers are not allowed as name';
    }

    // 4. Semester Out-of-Bounds Check
    const minSem = this.config().minSemester;
    const maxSem = this.config().maxSemester;
    if (
      this.studentData.semester !== null &&
      (this.studentData.semester < minSem || this.studentData.semester > maxSem)
    ) {
      this.fieldErrors['semester'] = `Semester must be between ${minSem} and ${maxSem}`;
    }

    // 5. Marks Out-of-Bounds Check
    const minM = this.config().minMarks;
    const maxM = this.config().maxMarks;
    if (
      this.studentData.marks !== null &&
      (this.studentData.marks < minM || this.studentData.marks > maxM)
    ) {
      this.fieldErrors['marks'] = `Marks must be between ${minM} and ${maxM}`;
    }

    // Stop submission if any validation error exists
    if (Object.keys(this.fieldErrors).length > 0) {
      this.errorMessage = 'Please complete all required fields and correct invalid entries.';
      return;
    }

    // Proceed to submit to Spring Boot
    this.isSubmitting = true;

this.dataService.addStudent(this.studentData).subscribe({
    next: () => {
      this.isSubmitting = false;
      // SUCCESS TOAST
      this.toastService.show('Student record registered successfully!', 'success');
      this.router.navigate(['/students']);
    },
    error: (err) => {
      this.isSubmitting = false;
      // ERROR TOAST
      this.toastService.show('Failed to register student record', 'error');

      if (err.status === 403) {
        this.errorMessage = 'Access Denied: You do not have permission to add students.';
      } else if (err.status === 400 && err.error?.errors) {
        this.fieldErrors = err.error.errors;
        this.errorMessage = 'Please fix the server validation errors below.';
      } else {
        this.errorMessage = err.error?.message || 'Failed to register student record.';
      }
    }
  });
  }
}