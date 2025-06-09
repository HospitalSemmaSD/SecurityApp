import { HttpResponse } from '@angular/common/http';
import { PaginationDTO } from '../models/paginationDTO';
import { Observable } from 'rxjs/internal/Observable';

export interface ICRUDService<TDTO, TCreateDTO> {
  getPagedList(pagination: PaginationDTO): Observable<HttpResponse<TDTO[]>>;
  getByFilter(filter: any): Observable<HttpResponse<TDTO[]>>;
  getALL(): Observable<HttpResponse<TDTO[]>>;
  getById(id: number): Observable<TDTO>;
  create(tdto: TCreateDTO): Observable<any>;
  update(id: number, entity: TCreateDTO): Observable<any>;
  delete(id: number): Observable<any>;
}
