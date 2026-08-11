import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl; // e.g., https://student-management-system-c3g8.onrender.com

  constructor(private http: HttpClient) { }

  // --- Department Endpoints ---
  getDepartment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/private/departments`);
  }

  getDepartments(page: number = 0, size: number = 5, sortBy: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // [NEW ADDITION] Attach sort parameter if selected (e.g., "name,asc" or "name,desc")
    if (sortBy && sortBy !== 'default') {
      params = params.set('sort', sortBy);
    }

    return this.http.get(`${this.apiUrl}/departments`, { params });
  }
  getDepartmentById(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/private/departments/${id}`);
  }

  addDepartment(departmentData: { name: string; headOfDepartment: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/private/departments`, departmentData);
  }

  updateDepartment(id: number | string, departmentData: { name: string; headOfDepartment: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/private/departments/${id}`, departmentData);
  }

  deleteDepartment(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/private/departments/${id}`);
  }

  // --- Student Endpoints ---
  getStudents(page: number = 0, size: number = 5, sortBy: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // [NEW ADDITION] Attach sort parameter if selected (e.g., "marks,desc")
    if (sortBy && sortBy !== 'default') {
      params = params.set('sort', sortBy);
    }

    return this.http.get<any>(`${this.apiUrl}/students`, { params });
  }

  getStudentById(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/private/students/${id}`);
  }

  addStudent(student: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/private/students`, student);
  }

  updateStudent(id: number | string, studentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/private/students/${id}`, studentData);
  }

  deleteStudent(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/private/students/${id}`);
  }

  reassignRollNumbers(): Observable<any> {
    return this.http.put(`${this.apiUrl}/private/students/reassign-roll-numbers`, {});
  }

  // --- Staff Endpoints ---
  getStaffByDepartment(deptId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/private/staff/department/${deptId}`);
  }

  addStaffManually(deptId: number | string, staffData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/private/staff/department/${deptId}`, staffData);
  }

  uploadStaffExcel(deptId: number | string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/private/staff/department/${deptId}/upload-excel`, formData);
  }

  updateStaff(id: number | string, staffData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/private/staff/${id}`, staffData);
  }

  deleteStaff(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/private/staff/${id}`);
  }
}