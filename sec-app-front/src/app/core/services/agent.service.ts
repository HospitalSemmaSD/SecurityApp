import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Agent } from '../models/agent.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/agents`;


  getAgents(page: number = 1, records: number = 10, status?: boolean): Observable<{agents: Agent[], totalRecords: number}> {
    let params = new HttpParams()
      .set('Page', page.toString())
      .set('RecordsPerPage', records.toString());
    
    if (status !== undefined) {
      params = params.set('status', status.toString());
    }
    
    return this.http.get<Agent[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<Agent[]>) => {
        const totalRecords = Number(response.headers.get('TotalRecords') || 0);
        return {
          agents: response.body || [],
          totalRecords: totalRecords
        };
      })
    );
  }

  getAgentById(id: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.apiUrl}/${id}`);
  }

  getAgentByCode(code: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.apiUrl}/code/${code}`);
  }

  getAgentByIdentification(ident: string): Observable<Agent> {
    return this.http.get<Agent>(`${this.apiUrl}/ident/${ident}`);
  }

  searchAgents(query: string): Observable<Agent[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Agent[]>(`${this.apiUrl}/search`, { params });
  }
  
  createAgent(agentData: FormData): Observable<Agent> {
    return this.http.post<Agent>(this.apiUrl, agentData);
  }

  updateAgent(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}