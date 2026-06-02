import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DutyAssignment, DutyAssignmentCreate } from '../models/duty-assignment.model';
import { WeeklyRoster } from '../models/weekly-roster.model';

@Injectable({ providedIn: 'root' })
export class DutyRosterService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dutyroster`;

  getRosterByWeek(startDate: string) {
    const params = new HttpParams().set('date', startDate);
    return this.http.get<DutyAssignment[]>(`${this.apiUrl}/daily`, { params });
  }

  getRosterStatus(startDate: string) {
    const params = new HttpParams().set('date', startDate);
    return this.http.get<WeeklyRoster>(`${this.apiUrl}/status`, { params });
  }

  closeRoster(startDate: string) {
    return this.http.post<WeeklyRoster>(`${this.apiUrl}/close`, { date: startDate });
  }

  reopenRoster(startDate: string) {
    return this.http.post(`${this.apiUrl}/reopen`, { date: startDate });
  }

  getRecentRosters() {
    return this.http.get<string[]>(`${this.apiUrl}/recent`);
  }

  cloneRoster(fromDate: string, toDate: string) {
    return this.http.post(`${this.apiUrl}/clone`, { fromDate, toDate });
  }

  assignAgent(data: DutyAssignmentCreate) {
    return this.http.post<DutyAssignment>(this.apiUrl, data);
  }

  removeAssignment(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  clearRoster(startDate: string) {
    const params = new HttpParams().set('date', startDate);
    return this.http.delete(`${this.apiUrl}/clear`, { params });
  }
}
