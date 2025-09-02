import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthResponseDTO, UserCredentialsDTO, UserProfileDTO } from './userCredentialsDTO';
import { Observable, tap } from 'rxjs';
import { PaginationDTO } from '../shared/models/paginationDTO';
import { getQueryParams } from '../shared/funtions/queryParams';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  private http = inject(HttpClient);
  private baseUrl = environment.API_URL + 'users';
  private readonly tokenKey = 'token';
  private readonly tokenExpiration = 'tokenExpiration';

  signUp(credentials: UserCredentialsDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.baseUrl}/signup`, credentials)
      .pipe(tap(authResponse => this.saveToken(authResponse))
      );
  }
  login(credentials: UserCredentialsDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(authResponse => this.saveToken(authResponse))
      );
  }

  saveToken(authResponseDTO: AuthResponseDTO): void {    
    localStorage.setItem(this.tokenKey, authResponseDTO.token);
    localStorage.setItem(this.tokenExpiration, authResponseDTO.tokenExpiration.toString());

  }
  getUsers(pagination: PaginationDTO): Observable<HttpResponse<UserProfileDTO[]>> {
    let queryParams = getQueryParams(pagination);
    return this.http.get<UserProfileDTO[]>(`${this.baseUrl}/UsersList`, { observe: 'response', params: queryParams });
  }

  makeAdmin(emai: string) {
    return this.http.post(`${this.baseUrl}/makeAdmin`, { email: emai });
  }

  removeAdmin(email: string) {
    return this.http.post(`${this.baseUrl}/removeAdmin`, { email: email });
  }

  isLoged(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const expiration = localStorage.getItem(this.tokenExpiration);
    const expirationDate = expiration ? new Date(expiration) : null;
    if (!expirationDate || expirationDate <= new Date()) {
      this.logout();
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiration);
  }

  getRol(): string {
    const isAdmin = this.getJWTClaims('isAdmin');
    console.log('isAdmin', isAdmin);
    if (isAdmin === 'true') {
      return 'admin';
    }
    return ''; // This should be replaced with actual logic to get the user's role
  }

  getJWTClaims(field: string): string {
    const token = localStorage.getItem(this.tokenKey);//this.getToken();
    if (!token) {
      return '';
    }
    const datatoken = JSON.parse(atob(token.split('.')[1]));
    console.log('datatoken', datatoken);
    return datatoken[field];
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) ?? '';
  }


}
