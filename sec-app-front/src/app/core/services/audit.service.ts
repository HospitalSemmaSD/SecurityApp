import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuditLog } from '../models/audit-log.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/audit`;

  getLogs(page: number, recordsPerPage: number): Observable<{logs: AuditLog[], totalRecords: number}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('recordsPerPage', recordsPerPage.toString());

    return this.http.get<AuditLog[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map(response => {
        const totalRecords = Number(response.headers.get('TotalRecords')) || 0;
        return { logs: response.body || [], totalRecords };
      })
    );
  }
}
