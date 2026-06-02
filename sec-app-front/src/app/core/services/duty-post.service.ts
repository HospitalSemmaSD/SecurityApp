import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DutyPost, DutyPostCreate } from '../models/duty-post.model';

@Injectable({ providedIn: 'root' })
export class DutyPostService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dutyposts`;

  getDutyPosts() {
    return this.http.get<DutyPost[]>(this.apiUrl);
  }

  getDutyPostById(id: number) {
    return this.http.get<DutyPost>(`${this.apiUrl}/${id}`);
  }

  createDutyPost(data: DutyPostCreate) {
    return this.http.post<DutyPost>(this.apiUrl, data);
  }

  updateDutyPost(id: number, data: DutyPostCreate) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteDutyPost(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
