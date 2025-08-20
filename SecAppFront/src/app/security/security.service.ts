import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthResponseDTO, UserCredentialsDTO } from './userCredentialsDTO';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  private http = inject(HttpClient);
  private baseUrl = environment.API_URL+ 'users'; 
  private readonly tokenKey = 'token';
  private readonly tokenExpiration = 'tokenExpiration';
  
singUp(credentials: UserCredentialsDTO):Observable<AuthResponseDTO>{
  return this.http.post<AuthResponseDTO>(`${this.baseUrl}/signup`, credentials)
  .pipe(
    tap(authResponse => this.saveToken(authResponse))
  );
}
login(credentials: UserCredentialsDTO):Observable<AuthResponseDTO>{
  return this.http.post<AuthResponseDTO>(`${this.baseUrl}/login`, credentials)
  .pipe(
    tap(authResponse => this.saveToken(authResponse))
  );
}

saveToken(authResponseDTO: AuthResponseDTO): void {    
    localStorage.setItem(this.tokenKey, authResponseDTO.token);
    localStorage.setItem(this.tokenExpiration, authResponseDTO.tokenExpiration.toString());
    
}
isLoged(): boolean {
  const token = localStorage.getItem(this.tokenKey);
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
    return 'admin'; // This should be replaced with actual logic to get the user's role
 }

}
