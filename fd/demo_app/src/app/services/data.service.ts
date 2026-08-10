import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Fetch Students
  // getStudent(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/students`); 
  // }

  // Fetch Departments
  getDepartment(): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments`);
  }
  addStudent(student: any): Observable<any> {
  return this.http.post('http://localhost:8080/private/students', student);
  }
  // Add this inside data.service.ts
  deleteStudent(id: number): Observable<any> {
  return this.http.delete(`http://localhost:8080/private/students/${id}`);
  }
  addDepartment(departmentData: { name: string; headOfDepartment: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/departments`, departmentData);
  }

  getDepartmentById(id: number | string): Observable<any> {
  return this.http.get(`${this.apiUrl}/departments/${id}`);
}

updateDepartment(id: number | string, departmentData: { name: string; headOfDepartment: string }): Observable<any> {
  return this.http.put(`${this.apiUrl}/departments/${id}`, departmentData);
}

// --- Student Endpoints ---
getStudentById(id: number | string): Observable<any> {
  return this.http.get(`${this.apiUrl}/students/${id}`);
}

updateStudent(id: number | string, studentData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/students/${id}`, studentData);
}

// --- Pagination Support ---
getDepartments(page: number = 0, size: number = 5): Observable<any> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  return this.http.get(`${this.apiUrl}/departments`, { params });
}

getStudents(page: number = 0, size: number = 5): Observable<any> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  return this.http.get(`${this.apiUrl}/students`, { params });
}
deleteDepartment(id: number | string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/departments/${id}`);
}
reassignRollNumbers(): Observable<any> {
  return this.http.put(`${this.apiUrl}/students/reassign-roll-numbers`, {});
}
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
deleteStaff(id: number | string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/staff/${id}`);
}
updateStaff(id: number | string, staffData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/staff/${id}`, staffData);
}
}