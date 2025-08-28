import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './auth/auth.effects';
import { PostEffects } from './home/post.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { UserEffects } from './users/user.effects';
import { MessageEffects } from './messages/message.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([JwtInterceptor])),
    importProvidersFrom(ReactiveFormsModule),
    importProvidersFrom(BrowserAnimationsModule),
  provideStore(appReducer),
  provideEffects([AuthEffects, PostEffects, MessageEffects, UserEffects]),
  provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ]
};
