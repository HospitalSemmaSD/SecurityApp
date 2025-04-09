import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentServiceService {

  constructor() { }
  private http = inject(HttpClient);
  private URLbase= 'http://localhost:5038/api/agents';
  
  
    public getAgents():Observable<any>{
      
      return this.http.get<any>(this.URLbase);    
    }

    public createAgent(agent: any):Observable<any>{
      return this.http.post<any>(this.URLbase, agent);  
    }
  
}
