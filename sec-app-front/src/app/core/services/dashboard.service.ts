import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CoverageStats, RankCount, WeeklyTrend } from '../models/dashboard.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getCoverageStats(): Observable<CoverageStats> {
    return this.http.get<CoverageStats>(`${this.apiUrl}/coverage`);
  }

  getRankDistribution(): Observable<RankCount[]> {
    return this.http.get<RankCount[]>(`${this.apiUrl}/ranks`);
  }

  getWeeklyTrend(): Observable<WeeklyTrend[]> {
    return this.http.get<WeeklyTrend[]>(`${this.apiUrl}/trend`);
  }
}
