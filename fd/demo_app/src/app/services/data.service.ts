import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // [FIXED] Globally attach /private to environment.apiUrl
  private apiUrl = `${environment.apiUrl}/private`;

  constructor(private http: HttpClient) { }

  // --- Department Endpoints ---
  getDepartment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments`);
  }

  getDepartments(page: number = 0, size: number = 5, sortBy: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sortBy && sortBy !== 'default') {
      params = params.set('sort', sortBy);
    }

    // [FIXED] Request now targets /private/departments
    return this.http.get(`${this.apiUrl}/departments`, { params });
  }

  getDepartmentById(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments/${id}`);
  }

  addDepartment(departmentData: { name: string; headOfDepartment: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/departments`, departmentData);
  }

  updateDepartment(id: number | string, departmentData: { name: string; headOfDepartment: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/departments/${id}`, departmentData);
  }

  deleteDepartment(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/departments/${id}`);
  }

  // --- Student Endpoints ---
  getStudents(page: number = 0, size: number = 5, sortBy: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sortBy && sortBy !== 'default') {
      params = params.set('sort', sortBy);
    }

    // [FIXED] Request now targets /private/students
    return this.http.get<any>(`${this.apiUrl}/students`, { params });
  }

  getStudentById(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/students/${id}`);
  }

  addStudent(student: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/students`, student);
  }

  updateStudent(id: number | string, studentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/students/${id}`, studentData);
  }

  deleteStudent(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${id}`);
  }

  reassignRollNumbers(): Observable<any> {
    return this.http.put(`${this.apiUrl}/students/reassign-roll-numbers`, {});
  }

  // --- Staff Endpoints ---
  getStaffByDepartment(deptId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/staff/department/${deptId}`);
  }

  addStaffManually(deptId: number | string, staffData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/staff/department/${deptId}`, staffData);
  }

  uploadStaffExcel(deptId: number | string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/staff/department/${deptId}/upload-excel`, formData);
  }

  updateStaff(id: number | string, staffData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/staff/${id}`, staffData);
  }

  deleteStaff(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/staff/${id}`);
  }
}