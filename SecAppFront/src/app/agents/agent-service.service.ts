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
    const formData = this.setFormData(agent);
    return this.http.post<AgentCreateDto>(this.baseURL, formData).pipe(
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
    return this.http.get<AgentDto>(`${this.baseURL}/${agentId}`);
  }
  public updateAgent(id: number, agent: AgentCreateDto) {
    const formData = this.setFormData(agent);
    console.log('FormData for update:', formData.values());
    return this.http.put(`${this.baseURL}/${id}`, formData);
  }

  public deleteAgent(id: number): Observable<void> {
    console.log('Deleting agent with ID:', id);
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }

  private setFormData(agent: AgentCreateDto): FormData {
    const formData = new FormData();
    formData.append('name', agent.name);
    formData.append('lastName', agent.lastName);
    formData.append('phone', agent.phone);
    formData.append('identification', agent.identification);
    formData.append('email', agent.email || '');
    formData.append('birthday', agent.birthday.toISOString().split('T')[0]);
    formData.append('status', String(agent.status));
    formData.append('rangeId', String(agent.rangeId));
    formData.append('institutionId', String(agent.institutionId));
    formData.append('agentCode', String(agent.agentCode));
    if (agent.photo) {
      formData.append('photo', agent.photo);
    }
    console.log('FormData created:', formData);
    return formData;
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
