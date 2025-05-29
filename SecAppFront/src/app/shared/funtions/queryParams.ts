import { HttpParams } from '@angular/common/http';

export function getQueryParams(obj: any): HttpParams {
  let params = new HttpParams();
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      params = params.append(prop, obj[prop]);
    }
  }
  return params;
}
