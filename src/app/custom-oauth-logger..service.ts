import { Injectable } from '@angular/core';
import { OAuthLogger } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class CustomOauthLoggerService {

  log(message: string): void {
    console.log(message);
  }

  warn(message: string): void {
    console.warn(message);
  }

  error(message: string): void {
    console.error(message);
  }
}