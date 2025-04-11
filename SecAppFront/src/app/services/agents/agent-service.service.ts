import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AgentCreateDto } from '../../models/agent';

@Injectable({
  providedIn: 'root',
})
export class AgentServiceService {
  constructor() {}
  private http = inject(HttpClient);
  private URLbase = 'http://localhost:5038/api/agents';

  public getAgents(): Observable<any> {
    return this.http.get<any>(this.URLbase);
  }

  public createAgent(agent: AgentCreateDto): Observable<AgentCreateDto> {
    agent.agentId = 0; // Set agentId to 0 for new agents
    if (!agent.photo) {
      agent.photo = ''; // Set rangeId to 0 if not provided
    }
    return this.http.post<AgentCreateDto>(this.URLbase, agent).pipe(
      catchError((error) => {
        console.error('ERROR CREANTO EL AGENTE:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }
}
