import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, UserCredentials } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`; 
  private tokenKey = 'token_seguridad';
  private readonly refreshTokenKey = 'refreshToken';

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
        this.saveToken(response.token, response.refreshToken);
        this._token.set(response.token);
      })
    );
  }

  private saveToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.tokenKey, token);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  getToken(): string | null {
    return this._token();
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  refreshToken(): Observable<AuthResponse> {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!token || !refreshToken) {
      return throwError(() => new Error('No hay tokens disponibles para refrescar.'));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { token, refreshToken }).pipe(
      tap((response) => {
        this.saveToken(response.token, response.refreshToken);
        this._token.set(response.token);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      error: (e) => console.warn('No se pudo registrar el cierre de sesión en la bitácora', e)
    });
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
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