import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Shift, ShiftCreate } from '../models/shift.model';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shifts`;

  getShifts() {
    return this.http.get<Shift[]>(this.apiUrl);
  }

  getShiftById(id: number) {
    return this.http.get<Shift>(`${this.apiUrl}/${id}`);
  }

  createShift(data: ShiftCreate) {
    return this.http.post<Shift>(this.apiUrl, data);
  }

  updateShift(id: number, data: ShiftCreate) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteShift(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
