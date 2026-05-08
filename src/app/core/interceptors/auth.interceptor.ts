import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const addAuthHeader = (req: HttpRequest<unknown>, token: string) =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  const token = localStorage.getItem('accessToken');
  const authReq = token ? addAuthHeader(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ha nem 401, vagy maga a refresh hívás hibásodott el, nincs mit tenni
      if (error.status !== 401 || req.url.includes('/refresh')) {
        if (error.status === 401) authService.logout();
        return throwError(() => error);
      }

      // 401 esetén megpróbáljuk megújítani a tokent, majd újraküldjük az eredeti kérést
      return authService.refreshToken().pipe(
        switchMap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          return next(addAuthHeader(req, response.accessToken));
        }),
        catchError((refreshError) => {
          // Ha a refresh is meghiúsul (lejárt a 7 nap), kijelentkeztetjük a felhasználót
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
