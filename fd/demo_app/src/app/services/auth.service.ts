import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/public/auth`;

  userRole = signal<string | null>(this.getStoredRole());
  token = signal<string | null>(this.getStoredToken());

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        let extractedRole = response?.role || response?.user?.role;

        const jwtToken = typeof response === 'string' ? response : response?.token;

        if (!extractedRole && jwtToken) {
          extractedRole = this.decodeRoleFromJwt(jwtToken);
        }

        this.setSession(jwtToken, extractedRole || 'ROLE_ADMIN');
      })
    );
  }

  setSession(jwtToken: string, role: string): void {
    if (isPlatformBrowser(this.platformId)) {
      if (jwtToken) localStorage.setItem('token', jwtToken);
      localStorage.setItem('role', role); // Standardized key: 'role'
    }
    this.token.set(jwtToken);
    this.userRole.set(role);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    this.token.set(null);
    this.userRole.set(null);
  }

  isUser(): boolean {
    const role = this.userRole();
    return role === 'ROLE_USER' || role === 'USER';
  }

  isAdmin(): boolean {
    const role = this.userRole();
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
  }

  private decodeRoleFromJwt(jwtToken: string): string {
    try {
      const payloadBase64 = jwtToken.split('.')[1];
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);

      if (decoded.role) return decoded.role;
      if (Array.isArray(decoded.roles) && decoded.roles.length > 0) return decoded.roles[0];
      if (Array.isArray(decoded.authorities) && decoded.authorities.length > 0) {
        return typeof decoded.authorities[0] === 'string' 
          ? decoded.authorities[0] 
          : decoded.authorities[0].authority;
      }
    } catch (e) {
      console.error('Failed to decode JWT role:', e);
    }
    return 'ROLE_USER';
  }

  private getStoredRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role');
    }
    return null;
  }

  private getStoredToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
}