import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { ConfirmModalService } from '../services/confirm-modal.service';

export interface Department {
  id?: number | string;
  code?: string;
  name: string;
  headOfDepartment?: string;
  studentCount?: number;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentsComponent implements OnInit {
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmModalService);
  private router = inject(Router);
  public authService = inject(AuthService);

  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;

  // Pagination State
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  currentSort: string = 'default';

  Math = Math;

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchDepartments(this.currentPage);
    }
  }

  fetchDepartments(page: number = 0): void {
    this.isLoading = true;
    this.currentPage = page;

    // ==========================================
    // [LOCAL HOST & PRODUCTION] Server-Side Paginated & Sorted Fetch
    // ==========================================
    this.dataService.getDepartments(this.currentPage, this.pageSize, this.currentSort).subscribe({
      next: (data: any) => {
        if (data && data.content) {
          this.departments = data.content;
          this.totalPages = data.totalPages || 0;
          this.totalElements = data.totalElements || 0;
          this.currentPage = data.number ?? page;
        } else {
          const list = Array.isArray(data) ? data : [];
          this.departments = list.sort((a: any, b: any) => {
            const idA = a.id ?? a.departmentId ?? 0;
            const idB = b.id ?? b.departmentId ?? 0;
            return idA - idB;
          });
          this.totalElements = this.departments.length;
          this.totalPages = Math.ceil(this.totalElements / this.pageSize) || 1;
        }

        this.onSearch();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load departments', err);
        this.toastService.show('Failed to load department records.', 'error');
        this.isLoading = false;
      }
    });
  }

  navigateToStaff(deptId: number | string | undefined): void {
    if (deptId !== undefined) {
      this.router.navigate(['/departments', deptId, 'staff']);
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.fetchDepartments(page);
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredDepartments = [...this.departments];
      return;
    }

    this.filteredDepartments = this.departments.filter(dept => 
      dept.name.toLowerCase().includes(term) || 
      (dept.code && dept.code.toLowerCase().includes(term))
    );
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    if (value === 'name-asc') {
      this.currentSort = 'name,asc';             // Sort A to Z by department name
    } else if (value === 'name-desc') {
      this.currentSort = 'name,desc';            // Sort Z to A by department name
    } else if (value === 'students-high') {
      this.currentSort = 'studentCount,desc';    // Sort highest student count first
    } else if (value === 'students-low') {
      this.currentSort = 'studentCount,asc';     // Sort lowest student count first
    } else {
      this.currentSort = 'default';
    }

    // Reset to page 0 to fetch top sorted records from database
    this.fetchDepartments(0);
  }

  async deleteDepartment(deptOrId: Department | string | number | undefined): Promise<void> {
    if (!deptOrId) return;

    const dept = typeof deptOrId === 'object' 
      ? deptOrId 
      : this.departments.find(d => d.id === deptOrId);

    const id = typeof deptOrId === 'object' ? dept?.id : deptOrId;

    if (!id) return;

    if (dept && dept.studentCount && dept.studentCount > 0) {
      await this.confirmService.confirm({
        title: 'Cannot Delete Department',
        message: `Not possible to delete ${dept.name} because there are ${dept.studentCount} student(s) currently enrolled in this department.`,
        confirmText: 'Understood',
        isAlert: true
      });
      return;
    }

    const confirmed = await this.confirmService.confirm({
      title: 'Delete Department?',
      message: 'Are you sure you want to remove this department? This action cannot be undone.',
      confirmText: 'Delete Department',
      cancelText: 'Cancel',
      isAlert: false
    });

    if (confirmed) {
      this.dataService.deleteDepartment(id).subscribe({
        next: () => {
          if (this.departments.length === 1 && this.currentPage > 0) {
            this.currentPage--;
          }
          this.toastService.show('Department removed successfully.', 'success');
          this.fetchDepartments(this.currentPage);
        },
        error: (err: any) => {
          console.error('Error deleting department:', err);

          const warningMsg = 'Not possible to delete the department since there is student data present corresponding to this department.';
          
          this.confirmService.confirm({
            title: 'Deletion Failed',
            message: warningMsg,
            confirmText: 'Understood',
            isAlert: true
          });

          this.toastService.show(warningMsg, 'error');
        }
      });
    }
  }
}