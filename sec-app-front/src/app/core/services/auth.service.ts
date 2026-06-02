import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, UserCredentials } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`; 
  private tokenKey = 'token_seguridad';

  // Signals para el estado global del usuario
  private _token = signal<string | null>(localStorage.getItem(this.tokenKey));
  
  currentUser = computed(() => {
    const token = this._token();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return {
        username: decoded.unique_name || 'Usuario',
        fullName: decoded.fullname || '',
        identification: decoded.identification || '',
        roles: this.parseRoles(decoded)
      };
    } catch {
      return null;
    }
  });

  isAuthenticated = computed(() => !!this._token());

  constructor() { }

  login(credentials: UserCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.saveToken(response.token);
        this._token.set(response.token);
      })
    );
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return this._token();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._token.set(null);
  }

  getUsername(): string {
    return this.currentUser()?.username || 'Oficial del Día';
  }

  getUserRoles(): string[] {
    return this.currentUser()?.roles || [];
  }

  hasRole(allowedRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return allowedRoles.some(role => userRoles.includes(role));
  }

  private parseRoles(payload: any): string[] {
    const roleKey = Object.keys(payload).find(key => key.toLowerCase().includes('role'));
    if (!roleKey || !payload[roleKey]) return [];
    const roles = payload[roleKey];
    return Array.isArray(roles) ? roles : [roles];
  }
}