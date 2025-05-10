import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterLink
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private oauthService: OAuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      'remember-me': [false]
    });

    if (isPlatformBrowser(this.platformId)) {
      this.configureOAuth();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.router.url.includes('/callback')) {
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Échec de la connexion OAuth. Veuillez réessayer.';
        }
      }).catch(() => {
        this.errorMessage = 'Erreur de connexion OAuth. Veuillez réessayer.';
      });
    }
  }

  private configureOAuth() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      clientId: environment.oauth.googleClientId,
      redirectUri: environment.oauth.redirectUri,
      silentRefreshRedirectUri: environment.oauth.silentRefreshUri,
      responseType: 'code',
      scope: 'openid profile email https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/calendar.readonly',
      showDebugInformation: true,
      strictDiscoveryDocumentValidation: false,
      requireHttps: false
    };
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidIdToken() || this.oauthService.hasValidAccessToken()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loginWithGoogle(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.oauthService.initCodeFlow();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).pipe(
        delay(100)
      ).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']).catch(() => {
            this.errorMessage = 'Échec de la navigation. Veuillez réessayer.';
          });
        },
        error: (err) => {
          this.errorMessage = err.message || 'Email ou mot de passe invalide';
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement.';
    }
  }

  handleContinueWithEmail(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const email = this.loginForm.get('email')?.value;
    if (email) {
      this.authService.continueWithEmail(email).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Email non trouvé. Veuillez vous inscrire ou réessayer.';
        }
      });
    } else {
      this.errorMessage = 'Veuillez entrer une adresse email';
    }
  }
}