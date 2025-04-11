import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private mortyApi = 'https://rickandmortyapi.com/api/character';
  constructor(private http: HttpClient) {}

  public getMorty(): Observable<any> {
    return this.http.get<any>(this.mortyApi);
  }
}
