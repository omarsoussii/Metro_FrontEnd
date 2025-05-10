import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { OAuthModule, OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider } from 'angular-oauth2-oidc';
import { CustomDateTimeProviderService } from './custom-date-time-provider.service';
import { CustomOauthLoggerService } from './custom-oauth-logger..service';
import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(OAuthModule.forRoot()),
    importProvidersFrom(BrowserAnimationsModule),
    { provide: OAuthService, useClass: OAuthService },
    { provide: UrlHelperService, useClass: UrlHelperService },
    { provide: OAuthLogger, useClass: CustomOauthLoggerService },
    { provide: DateTimeProvider, useClass: CustomDateTimeProviderService }, provideAnimationsAsync()
  ]
};