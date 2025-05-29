import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AgentCreateDto, AgentDto } from './models/agent';
import { environment } from '../../environments/environment'; // Adjust the import path as needed
import { DatePipe } from '@angular/common';
import { PaginationDTO } from '../shared/models/paginationDTO';
import { getQueryParams } from '../shared/funtions/queryParams';

@Injectable({
  providedIn: 'root',
})
export class AgentServiceService {
  constructor() {}
  private http = inject(HttpClient);
  private baseURL = environment.API_URL + 'agents';

  public getAgentsPagedList(
    pagination: PaginationDTO
  ): Observable<HttpResponse<AgentDto[]>> {
    let queryParams = getQueryParams(pagination);
    return this.http.get<AgentDto[]>(this.baseURL, {
      params: queryParams,
      observe: 'response',
    });
  }

  public createAgent(agent: AgentCreateDto) {
    return this.http.post<AgentCreateDto>(this.baseURL, agent).pipe(
      catchError((error) => {
        console.error('ERROR CREANTO EL AGENTE:', error);
        throw error;
      })
    );
  }

  public getAgents(): Observable<AgentDto> {
    return this.http.get<AgentDto>(this.baseURL).pipe(
      catchError((error) => {
        console.error('ERROR OBTENIENDO EL AGENTE:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }
  public getAgentById(agentId: number): Observable<AgentDto> {
    return this.http.get<AgentDto>(`${this.baseURL}/${agentId}`).pipe(
      catchError((error) => {
        console.error('ERROR OBTENIENDO EL AGENTE:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }
  public updateAgent(id: number, agent: AgentCreateDto) {
    // if (!agent.photo) {
    //   agent.photo = '';
    // }
    // return this.http.patch<AgentDto>(this.baseURL, agent).pipe(
    //   catchError((error) => {
    //     console.error('ERROR CREANTO EL AGENTE:', error);
    //     throw error; // Rethrow the error to propagate it to the caller
    //   })
    // );
    return this.http.put(` + this.baseURL + /${id}`, agent);
  }

  public deleteAgent(id: number): Observable<void> {
    console.log('Deleting agent with ID:', id);
    return this.http.delete<void>(`${this.baseURL}/${id}`);
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
