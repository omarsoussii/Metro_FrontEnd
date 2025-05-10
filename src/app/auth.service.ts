import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: { email: string; password: string; rememberMe: boolean }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
      observe: 'response'
    }).pipe(
      map(response => response.body),
      catchError(error => {
        const errorMessage = error.error?.error || 'Email ou mot de passe invalide';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  continueWithEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/continue-with-email`, { email }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/forgot-password`, { email }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  checkAuthentication(): Observable<boolean> {
    return this.http.get<{ authenticated: boolean }>(`${this.apiUrl}/api/auth/check`, {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<{ authenticated: boolean }>) => {
        return response.body?.authenticated || false;
      }),
      catchError(() => of(false))
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/reset-password`, {
      token,
      password: newPassword,
      confirmPassword: newPassword
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private getCookies(): string {
    if (isPlatformBrowser(this.platformId)) {
      return document.cookie;
    }
    return 'N/A (server-side)';
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error.status === 0) {
      errorMessage = 'Erreur réseau – vérifiez votre connexion ou le serveur API.';
    }
    return throwError(() => new Error(errorMessage));
  }
}