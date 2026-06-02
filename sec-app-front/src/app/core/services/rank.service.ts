import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rank } from '../models/rank.model';

@Injectable({
  providedIn: 'root'
})
export class RankService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ranks`;

  getRanks(): Observable<Rank[]> {
    return this.http.get<Rank[]>(this.apiUrl);
  }

  getRankById(id: number): Observable<Rank> {
    return this.http.get<Rank>(`${this.apiUrl}/${id}`);
  }
getRanksByInstitution(institutionId: number) {
    return this.http.get<Rank[]>(`${this.apiUrl}/institution/${institutionId}`);
  }
  createRank(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateRank(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteRank(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 