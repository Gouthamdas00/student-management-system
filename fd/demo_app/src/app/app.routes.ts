import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { StudentsComponent } from './students/students.component';
import { DepartmentsComponent } from './department/department.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { SettingsComponent } from './settings/settings.component';
import { roleGuard } from './guards/role.guard'; // Import Guard
import { EditStudentComponent } from './edit-student/edit-student.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';
import { StaffModalComponent } from './staff-modal/staff-modal.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route (Landing Page)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'students/add', component: AddStudentComponent, canActivate: [roleGuard] },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'departments/add', component: AddDepartmentComponent, canActivate: [roleGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [roleGuard] },
  { path: 'departments/edit/:id', component: EditDepartmentComponent, canActivate: [roleGuard] },
  { path: 'students/edit/:id', component: EditStudentComponent, canActivate: [roleGuard] },
  { path: 'departments/:id/staff', component: StaffModalComponent },
  { path: '**', redirectTo: '' } 
];