import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideNgxMask } from 'ngx-mask';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { authInterceptor } from './security/token-interceptor-http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),

    provideNgxMask({}),
    provideMomentDateAdapter({
      parse: {
        dateInput: ['DD-MM-YYYY'],
      },
      display: {
        dateInput: 'DD-MM-YYYY',
        monthYearLabel: 'M YY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
    }),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
    importProvidersFrom([SweetAlert2Module.forRoot()]),
  ],
};
