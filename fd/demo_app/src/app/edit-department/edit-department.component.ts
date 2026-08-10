import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './edit-department.component.html',
  styleUrl: './edit-department.component.css'
})
export class EditDepartmentComponent implements OnInit {
  private toastService = inject(ToastService);
  departmentId!: number | string;
  departmentData = {
    name: '',
    headOfDepartment: ''
  };

  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.departmentId = id;
      this.fetchDepartmentDetails(id);
    } else {
      this.router.navigate(['/departments']);
    }
  }
fetchDepartmentDetails(id: number | string): void {
    this.isLoading = true;
    this.dataService.getDepartmentById(id).subscribe({
      next: (data: any) => {
        this.departmentData = {
          name: data.name || '',
          headOfDepartment: data.headOfDepartment || ''
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load department details', err);
        // ERROR TOAST
        this.toastService.show('Failed to load department details', 'error');
        this.errorMessage = 'Failed to load department details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    let hasErrors = false;

    if (!this.departmentData.name || !this.departmentData.name.trim()) {
      this.fieldErrors['name'] = 'Department name is required.';
      hasErrors = true;
    }

    if (!this.departmentData.headOfDepartment || !this.departmentData.headOfDepartment.trim()) {
      this.fieldErrors['headOfDepartment'] = 'Head of Department is required.';
      hasErrors = true;
    }

    if (hasErrors) {
      this.errorMessage = 'Please fix the validation errors before submitting.';
      return;
    }

    this.isSubmitting = true;

    this.dataService.updateDepartment(this.departmentId, this.departmentData).subscribe({
    next: () => {
      this.isSubmitting = false;
      // SUCCESS TOAST
      this.toastService.show('Department updated successfully!', 'success');
      this.router.navigate(['/departments']);
    },
    error: (err) => {
      console.error('Error updating department:', err);
      this.isSubmitting = false;
      // ERROR TOAST
      this.toastService.show('Failed to update department', 'error');

      if (err.error && typeof err.error === 'object') {
        if (err.error.fieldErrors) {
          this.fieldErrors = err.error.fieldErrors;
        }
        this.errorMessage = err.error.message || 'Failed to update department. Please try again.';
      } else {
        this.errorMessage = 'An unexpected server error occurred. Please try again.';
      }
    }
  });
  }
}