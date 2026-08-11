import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { ConfirmModalService } from '../services/confirm-modal.service';

export interface Student {
  id?: number | string;
  rollNumber?: number | string;
  name: string;
  departmentId?: number | string;
  departmentName?: string;
  department?: { id?: number | string; name?: string };
  semester?: number;
  marks?: number;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmModalService);
  public authService = inject(AuthService);

  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;

  currentSort: string = 'default';
  // Pagination State
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;

  // Expose Math for inline template calculation
  Math = Math;

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchStudents(this.currentPage);
    }
  }

  // [NEW FIX] Passes this.currentSort to dataService so Spring Boot handles full-table sorting
  fetchStudents(page: number = 0): void {
    this.isLoading = true;
    this.currentPage = page;

    // ==========================================
    // [LOCAL HOST & PRODUCTION] Server-Side Paginated & Sorted Fetch
    // ==========================================
    this.dataService.getStudents(this.currentPage, this.pageSize, this.currentSort).subscribe({
      next: (data: any) => {
        if (data && data.content) {
          this.students = data.content;
          this.totalPages = data.totalPages || 0;
          this.totalElements = data.totalElements || 0;
          this.currentPage = data.number ?? page;
        } else {
          const list = Array.isArray(data) ? data : [];
          this.students = list;
          this.totalElements = this.students.length;
          this.totalPages = Math.ceil(this.totalElements / this.pageSize) || 1;
        }

        this.onSearch();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load students', err);
        this.toastService.show('Failed to load student directory.', 'error');
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.fetchStudents(page);
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredStudents = [...this.students];
      return;
    }

    this.filteredStudents = this.students.filter(student =>
      student.name.toLowerCase().includes(term) ||
      (student.departmentName && student.departmentName.toLowerCase().includes(term)) ||
      (student.department?.name && student.department.name.toLowerCase().includes(term))
    );
  }

  // [NEW FIX] Maps dropdown selections to Spring Data Pageable sort query parameters
  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    if (value === 'high-low') {
      this.currentSort = 'marks,desc'; // Sort entire DB table by marks descending
    } else if (value === 'low-high') {
      this.currentSort = 'marks,asc';  // Sort entire DB table by marks ascending
    } else if (value === 'name-asc') {
      this.currentSort = 'name,asc';   // Optional: Sort A-Z by student name
    } else {
      this.currentSort = 'default';
    }

    // Always restart from page 0 so the top sorted records from DB are retrieved first
    this.fetchStudents(0);
  }

  async deleteStudent(studentOrId: Student | number | string | undefined): Promise<void> {
    if (studentOrId === undefined || studentOrId === null) return;

    const student = typeof studentOrId === 'object'
      ? studentOrId
      : this.students.find(s => s.id === studentOrId || s.rollNumber === studentOrId);

    const rawId = typeof studentOrId === 'object' ? (student?.id ?? student?.rollNumber) : studentOrId;

    if (rawId === undefined || rawId === null) return;

    const numericId = Number(rawId);
    if (isNaN(numericId)) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Delete Student Record?',
      message: `Are you sure you want to remove ${student?.name || 'this student'}? All associated academic data will be permanently deleted.`,
      confirmText: 'Delete Student',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.dataService.deleteStudent(numericId).subscribe({
        next: () => {
          if (this.students.length === 1 && this.currentPage > 0) {
            this.currentPage--;
          }
          this.toastService.show('Student record removed successfully.', 'success');
          this.fetchStudents(this.currentPage);
        },
        error: (err: any) => {
          console.error('Error deleting student:', err);
          this.toastService.show('Failed to remove student record.', 'error');
        }
      });
    }
  }

  async reassignRollNumbers(): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Reassign Roll Numbers?',
      message: 'This will re-index all student roll numbers sequentially (1, 2, 3...) sorted alphabetically by student name. Do you want to proceed?',
      confirmText: 'Reassign All',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.isLoading = true;
      this.dataService.reassignRollNumbers().subscribe({
        next: () => {
          this.toastService.show('Roll numbers reassigned successfully!', 'success');
          this.fetchStudents(this.currentPage);
        },
        error: (err) => {
          console.error('Failed to reassign roll numbers', err);
          this.toastService.show('Failed to reassign roll numbers.', 'error');
          this.isLoading = false;
        }
      });
    }
  }
}