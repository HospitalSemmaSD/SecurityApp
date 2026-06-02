import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserCreate, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  createUser(userData: UserCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }

  getAvailableRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }

  assignRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/roles/${role}`, {});
  }

  removeRole(userId: string, role: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/roles/${role}`);
  }
}