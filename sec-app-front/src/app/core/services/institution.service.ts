import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Institution, InstitutionCreate } from '../models/institution.model';

@Injectable({ providedIn: 'root' })
export class InstitutionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/institutions`;

  getInstitutions() {
    return this.http.get<Institution[]>(this.apiUrl);
  }

  createInstitution(data: InstitutionCreate) {
    return this.http.post<Institution>(this.apiUrl, data);
  }

  updateInstitution(id: number, data: InstitutionCreate) {
    return this.http.put<Institution>(`${this.apiUrl}/${id}`, data);
  }
  
  deleteInstitution(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}