import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from './auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtUtilsService } from '../utils/jwt-utils.service';
import { MessageHubService } from '../messages/message-hub.service';

@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  authService = inject(AuthService);
  router = inject(Router);
  messageHubService = inject(MessageHubService);
  snackBar = inject(MatSnackBar);
  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => {
        this.snackBar.open('Registration successful! Please log in.', 'Close', { duration: 3000, panelClass: 'snackbar-accent' });
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ user }) => {
        if (user && user.token) {
          localStorage.setItem('jwt', user.token);
          // Start SignalR connection after JWT is set
          const userId = JwtUtilsService.getUserId();
          if (userId) {
            this.messageHubService.start(userId);
          }
          this.router.navigate(['/']);
        }
      })
    ),
    { dispatch: false }
  );

  logoutSignalR$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.messageHubService.stop();
      })
    ),
    { dispatch: false }
  );
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('jwt');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map(user => AuthActions.loginSuccess({ user })),
          catchError(error => of(AuthActions.loginFailure({ error: error.message || 'Login failed' })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ username, password }) =>
        this.authService.register(username, password).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError(error => of(AuthActions.registerFailure({ error: error.message || 'Registration failed' })))
        )
      )
    )
  );
}
