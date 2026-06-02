import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ShiftIncident, ShiftIncidentCreate, InternalNotice, InternalNoticeCreate } from '../models/communication.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private http = inject(HttpClient);
  private incidentsUrl = `${environment.apiUrl}/incidents`;
  private noticesUrl = `${environment.apiUrl}/notices`;

  // --- Novedades (Incidencias) ---
  getRecentIncidents(): Observable<ShiftIncident[]> {
    return this.http.get<ShiftIncident[]>(this.incidentsUrl);
  }

  createIncident(incident: ShiftIncidentCreate): Observable<ShiftIncident> {
    return this.http.post<ShiftIncident>(this.incidentsUrl, incident);
  }

  // --- Comunicados (Noticias) ---
  getActiveNotices(): Observable<InternalNotice[]> {
    return this.http.get<InternalNotice[]>(`${this.noticesUrl}/active`);
  }

  createNotice(notice: InternalNoticeCreate): Observable<InternalNotice> {
    return this.http.post<InternalNotice>(this.noticesUrl, notice);
  }
}
