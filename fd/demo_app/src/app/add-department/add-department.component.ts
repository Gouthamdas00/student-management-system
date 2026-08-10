import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.css'
})
export class AddDepartmentComponent {
  private toastService = inject(ToastService);
  private dataService = inject(DataService);
  private router = inject(Router);

  departmentData = {
    name: '',
    headOfDepartment: ''
  };

  isSubmitting = false;
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    form.control.markAllAsTouched();

    if (!this.departmentData.name || !this.departmentData.name.trim()) {
      this.fieldErrors['name'] = 'Department name is required.';
    }

    if (!this.departmentData.headOfDepartment || !this.departmentData.headOfDepartment.trim()) {
      this.fieldErrors['headOfDepartment'] = 'Head of Department is required.';
    }

    if (Object.keys(this.fieldErrors).length > 0) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.isSubmitting = true;

    this.dataService.addDepartment(this.departmentData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.show('New department added successfully!', 'success');
        this.router.navigate(['/departments']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastService.show('Failed to add department.', 'error');

        if (err.status === 403) {
          this.errorMessage = 'Access Denied: You do not have permission to add departments.';
        } else {
          this.errorMessage = err.error?.message || 'Failed to create department record.';
        }
      }
    });
  }
}