import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AgentCreateDto, AgentDto } from '../models/agent';
import { environment } from '../../environments/environment'; // Adjust the import path as needed
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AgentServiceService {
  constructor() {}
  private http = inject(HttpClient);
  private baseURL = environment.API_URL + 'agents'; // Adjust the URL as needed

  public getAgents(): Observable<AgentDto[]> {
    return this.http.get<AgentDto[]>(this.baseURL + '/GetAgentsRanges');
  }

  public createAgent(agent: AgentCreateDto): Observable<AgentCreateDto> {
    //agent.agentId = 0; // Set agentId to 0 for new agents
    //const datePipe = new DatePipe('en-US');

    //console.log('fecha sin transformar: ', agent.birthday);

    //agent.birthday = datePipe.transform(agent.birthday, 'yyyy-MM-dd');

    if (!agent.photo) {
      //agent.photo = '';
    }

    return this.http.post<AgentCreateDto>(this.baseURL, agent).pipe(
      catchError((error) => {
        // console.log('fecha transformada: ', agent.birthday);
        console.error('ERROR CREANTO EL AGENTE:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }
  public updateAgent(agent: AgentDto): Observable<AgentDto> {
    //agent.agentId = 0; // Set agentId to 0 for new agents
    if (!agent.photo) {
      agent.photo = ''; // Set rangeId to 0 if not provided
    }
    return this.http.patch<AgentDto>(this.baseURL, agent).pipe(
      catchError((error) => {
        console.error('ERROR CREANTO EL AGENTE:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string }>(
      `${this.baseURL}/upload-photo`,
      formData
    );
  }
}
