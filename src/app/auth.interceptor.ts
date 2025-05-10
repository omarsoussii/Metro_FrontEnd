import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from './environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const oauthService = inject(OAuthService);
  const platformId = inject(PLATFORM_ID);

  const isApiRequest = req.url.startsWith(environment.apiUrl);

  let headers = req.headers.set('Content-Type', 'application/json');

  if (isApiRequest) {
    const token = oauthService.getAccessToken() || oauthService.getIdToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const modifiedReq = isApiRequest
    ? req.clone({
        headers,
        withCredentials: true
      })
    : req;

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'Une erreur est survenue';
      if (error.status === 0) {
        errorMsg = 'Erreur réseau – vérifiez votre connexion ou le serveur API.';
      }
      return throwError(() => new Error(errorMsg));
    })
  );
}