import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

const addAuthHeader = (req: HttpRequest<unknown>, token: string) =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('accessToken');
  const authReq = token ? addAuthHeader(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ha nem 401 vagy már egy refresh kérés hibásodott el → kijelentkeztetés
      if (error.status !== 401 || req.url.includes('/refresh')) {
        if (error.status === 401) {
          authService.logout();
        }
        return throwError(() => error);
      }

      // 401 → megpróbáljuk a tokent megújítani
      return authService.refreshToken().pipe(
        switchMap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          // Újra elküldjük az eredeti kérést az új tokennel
          return next(addAuthHeader(req, response.accessToken));
        }),
        catchError((refreshError) => {
          // Refresh is meghiúsult → kijelentkeztetés
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
