import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { ConfirmModalService } from '../services/confirm-modal.service';

export interface Staff {
  id?: number;
  name: string;
  subject: string;
  designation: string;
  email: string;
}

@Component({
  selector: 'app-staff-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './staff-modal.component.html',
  styleUrl: './staff-modal.component.css'
})
export class StaffModalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmModalService);
  public authService = inject(AuthService);

  departmentId!: number | string;
  staffList: Staff[] = [];
  filteredStaffList: Staff[] = []; // Holds active search results
  searchTerm: string = '';
  isLoading: boolean = true;

  activeView: 'list' | 'manual' | 'excel' | 'edit' = 'list';

  newStaff: Staff = { name: '', subject: '', designation: '', email: '' };
  editingStaff: Staff = { name: '', subject: '', designation: '', email: '' };
  isSubmitting: boolean = false;
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id') || '';
    if (this.departmentId) {
      this.fetchStaff();
    }
  }

  fetchStaff(): void {
    this.isLoading = true;
    this.dataService.getStaffByDepartment(this.departmentId).subscribe({
      next: (data: Staff[]) => {
        this.staffList = data || [];
        this.onSearch(); // Apply search filter if user reloads while typing
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load staff:', err);
        this.toastService.show('Failed to load department staff.', 'error');
        this.isLoading = false;
      }
    });
  }

  // --- Real-time Search Logic ---
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredStaffList = [...this.staffList];
      return;
    }

    this.filteredStaffList = this.staffList.filter(staff =>
      (staff.name && staff.name.toLowerCase().includes(term)) ||
      (staff.subject && staff.subject.toLowerCase().includes(term)) ||
      (staff.designation && staff.designation.toLowerCase().includes(term)) ||
      (staff.email && staff.email.toLowerCase().includes(term))
    );
  }

  onAddManualStaff(): void {
    if (!this.newStaff.name.trim()) return;

    this.isSubmitting = true;
    this.dataService.addStaffManually(this.departmentId, this.newStaff).subscribe({
      next: () => {
        this.toastService.show('Faculty member added successfully!', 'success');
        this.newStaff = { name: '', subject: '', designation: '', email: '' };
        this.isSubmitting = false;
        this.activeView = 'list';
        this.fetchStaff();
      },
      error: () => {
        this.toastService.show('Failed to add faculty member.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  openEditStaff(staff: Staff): void {
    this.editingStaff = { ...staff };
    this.activeView = 'edit';
  }

  onUpdateStaff(): void {
    if (!this.editingStaff.name.trim() || !this.editingStaff.id) return;

    this.isSubmitting = true;
    this.dataService.updateStaff(this.editingStaff.id, this.editingStaff).subscribe({
      next: () => {
        this.toastService.show('Faculty record updated successfully!', 'success');
        this.isSubmitting = false;
        this.activeView = 'list';
        this.fetchStaff();
      },
      error: () => {
        this.toastService.show('Failed to update faculty record.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  async deleteStaff(staff: Staff): Promise<void> {
    if (!staff.id) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Remove Staff Member?',
      message: `Are you sure you want to remove ${staff.name}?`,
      confirmText: 'Remove Staff',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.dataService.deleteStaff(staff.id).subscribe({
        next: () => {
          this.toastService.show('Staff member removed successfully.', 'success');
          this.fetchStaff();
        },
        error: () => {
          this.toastService.show('Failed to remove staff member.', 'error');
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUploadExcel(): void {
    if (!this.selectedFile) return;

    this.isSubmitting = true;
    this.dataService.uploadStaffExcel(this.departmentId, this.selectedFile).subscribe({
      next: () => {
        this.toastService.show('Staff list imported successfully!', 'success');
        this.selectedFile = null;
        this.isSubmitting = false;
        this.activeView = 'list';
        this.fetchStaff();
      },
      error: () => {
        this.toastService.show('Failed to import Excel file.', 'error');
        this.isSubmitting = false;
      }
    });
  }
}