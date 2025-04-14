import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AgentCreateDto } from '../../models/agent';
import { environment } from '../../../environments/environment'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root',
})
export class AgentServiceService {
  constructor() {}
  private http = inject(HttpClient);
  private URLbase = environment.API_URL + 'agents'; // Adjust the URL as needed

  public getAgents(): Observable<any> {
    return this.http.get<any>(this.URLbase);
  }

  public createAgent(agent: AgentCreateDto): Observable<AgentCreateDto> {
    //agent.agentId = 0; // Set agentId to 0 for new agents
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
  public updateAgent(agent: AgentCreateDto): Observable<AgentCreateDto> {
    //  agent.agentId = 0; // Set agentId to 0 for new agents
    if (!agent.photo) {
      agent.photo = ''; // Set rangeId to 0 if not provided
    }
    return this.http.patch<AgentCreateDto>(this.URLbase, agent).pipe(
      catchError((error) => {
        console.error('ERROR CREANTO EL AGENTE:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }
}
