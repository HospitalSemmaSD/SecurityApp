import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Responsible, ResponsibleCreate } from '../models/responsible.model';

@Injectable({ providedIn: 'root' })
export class ResponsibleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/responsibles`;

  getResponsibles() {
    return this.http.get<Responsible[]>(this.apiUrl);
  }

  getActiveResponsibles() {
    return this.http.get<Responsible[]>(`${this.apiUrl}/active`);
  }

  createResponsible(data: ResponsibleCreate) {
    return this.http.post<Responsible>(this.apiUrl, data);
  }

  updateResponsible(id: number, data: ResponsibleCreate) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteResponsible(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
