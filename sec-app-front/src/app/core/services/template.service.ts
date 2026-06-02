import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RosterTemplate, RosterTemplateCreate, RosterTemplateData } from '../models/template.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/templates`;

  getTemplates(): Observable<RosterTemplate[]> {
    return this.http.get<RosterTemplate[]>(this.apiUrl);
  }

  getTemplateData(id: number): Observable<RosterTemplateData> {
    return this.http.get<RosterTemplateData>(`${this.apiUrl}/${id}`);
  }

  createTemplate(template: RosterTemplateCreate): Observable<RosterTemplate> {
    return this.http.post<RosterTemplate>(this.apiUrl, template);
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
