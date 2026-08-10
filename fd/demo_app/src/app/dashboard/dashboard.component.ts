import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  students: any[] = [];
  departments: any[] = [];
  totalStudentsCount: number = 0;
  totalDepartmentsCount: number = 0;
  
  isLoading = true;
  username: string = 'Admin';

  constructor(
    private dataService: DataService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        this.username = savedUsername;
      }

      const token = localStorage.getItem('token');
      console.log('DEBUG: Token in Dashboard ngOnInit:', token);
      
      if (token) {
        this.loadDashboardData();
      } else {
        console.warn('DEBUG: No token found in localStorage, redirecting to login...');
        this.router.navigate(['/login']);
      }
    }
  }

loadDashboardData() {
    this.isLoading = true;
    
    // Pass a larger size (e.g., 1000) if you need all student records on the dashboard,
    // or read totalElements from the pagination response
    this.dataService.getStudents(0, 1000).subscribe({
      next: (studentPageData: any) => {
        // Extract total count directly from Spring Page metadata
        if (studentPageData && studentPageData.totalElements !== undefined) {
          this.totalStudentsCount = studentPageData.totalElements;
          this.students = studentPageData.content || [];
        } else {
          const list = Array.isArray(studentPageData) ? studentPageData : (studentPageData?.content || []);
          this.students = list;
          this.totalStudentsCount = list.length;
        }

        // Fetch Departments
        this.dataService.getDepartments(0, 1000).subscribe({
          next: (deptData: any) => {
            if (deptData && deptData.totalElements !== undefined) {
              this.totalDepartmentsCount = deptData.totalElements;
              this.departments = deptData.content || [];
            } else {
              const list = Array.isArray(deptData) ? deptData : (deptData?.content || []);
              this.departments = list;
              this.totalDepartmentsCount = list.length;
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load departments', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Failed to load students', err);
        this.isLoading = false;
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
      }
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    this.router.navigate(['/login']);
  }
}