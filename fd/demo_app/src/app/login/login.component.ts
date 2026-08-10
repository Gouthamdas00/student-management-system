import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login(this.loginData).subscribe({
    next: (response: any) => {
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);

        // Small delay or direct navigation after local storage write
        this.router.navigate(['/dashboard']);
      }
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Login failed', err);
    }
  });
}
}