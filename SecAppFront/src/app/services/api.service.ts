import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private mortyApi = 'https://rickandmortyapi.com/api/character';
  private securityApi = 'http://localhost:5038/api/agents';
  constructor(private http: HttpClient) { }

  public getMorty() : Observable<any> {
    return this.http.get<any>(this.mortyApi);
  }

  public getAgents():Observable<any>{
    
    return this.http.get<any>(this.securityApi);    
  }

}
