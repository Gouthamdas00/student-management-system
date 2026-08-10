import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DataService } from '../services/data.service';
import { FormConfigService } from '../services/form-config.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './edit-student.component.html',
  styleUrl: './edit-student.component.css'
})
export class EditStudentComponent implements OnInit {
  private toastService = inject(ToastService);
  studentId!: number | string;
  studentData: {
    name: string;
    departmentId: string | number;
    semester: number | null;
    marks: number | null;
  } = {
    name: '',
    departmentId: '',
    semester: null,
    marks: null
  };
  departments: any[] = [];
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  fieldErrors: { [key: string]: string } = {};

  config;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private configService: FormConfigService,
    private router: Router
  ) {
    this.config = this.configService.studentConfig;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentId = id;
      this.fetchInitialData(id);
    } else {
      this.router.navigate(['/students']);
    }
  }

  fetchInitialData(id: number | string): void {
    this.isLoading = true;

    this.dataService.getDepartments().subscribe({
      next: (depts: any) => {
        this.departments = Array.isArray(depts) ? depts : (depts?.content || []);

        this.dataService.getStudentById(id).subscribe({
          next: (data: any) => {
            const rawDeptId = data.departmentId ?? data.department?.id ?? data.deptId;
            this.studentData = {
              name: data.name || '',
              departmentId: rawDeptId !== undefined && rawDeptId !== null ? Number(rawDeptId) : '',
              semester: data.semester ?? null,
              marks: data.marks ?? null
            };
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load student details', err);
            this.toastService.show('Failed to load student details.', 'error');
            this.errorMessage = 'Failed to load student record. Please try again.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Failed to load departments', err);
        this.toastService.show('Failed to load departments dropdown.', 'error');
        this.isLoading = false;
      }
    });
  }

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    let hasErrors = false;

    if (!this.studentData.name || !this.studentData.name.trim()) {
      this.fieldErrors['name'] = 'Student name is required.';
      hasErrors = true;
    }

    if (!this.studentData.departmentId) {
      this.fieldErrors['departmentId'] = 'Please select a department.';
      hasErrors = true;
    }

    const currentConfig = this.config();

    if (this.studentData.semester === null || this.studentData.semester === undefined) {
      this.fieldErrors['semester'] = 'Semester is required.';
      hasErrors = true;
    } else if (this.studentData.semester < currentConfig.minSemester || this.studentData.semester > currentConfig.maxSemester) {
      this.fieldErrors['semester'] = `Semester must be between ${currentConfig.minSemester} and ${currentConfig.maxSemester}.`;
      hasErrors = true;
    }

    if (this.studentData.marks === null || this.studentData.marks === undefined) {
      this.fieldErrors['marks'] = 'Marks / score is required.';
      hasErrors = true;
    } else if (this.studentData.marks < currentConfig.minMarks || this.studentData.marks > currentConfig.maxMarks) {
      this.fieldErrors['marks'] = `Marks must be between ${currentConfig.minMarks} and ${currentConfig.maxMarks}.`;
      hasErrors = true;
    }

    if (hasErrors) {
      this.errorMessage = 'Please fix the validation errors before submitting.';
      return;
    }

    this.isSubmitting = true;

    this.dataService.updateStudent(this.studentId, this.studentData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.show('Student record updated successfully!', 'success');
        this.router.navigate(['/students']);
      },
      error: (err) => {
        console.error('Error updating student:', err);
        this.isSubmitting = false;
        this.toastService.show('Failed to update student record.', 'error');

        if (err.error && typeof err.error === 'object') {
          if (err.error.fieldErrors) {
            this.fieldErrors = err.error.fieldErrors;
          }
          this.errorMessage = err.error.message || 'Failed to update student record. Please try again.';
        } else {
          this.errorMessage = 'An unexpected server error occurred. Please try again.';
        }
      }
    });
  }
}