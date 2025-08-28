import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from './user.service';
import * as UserReducer from './user.reducer';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class UserEffects {
    actions$ = inject(Actions);
    userService = inject(UserService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserReducer.loadUsers),
      mergeMap(() =>
        this.userService.getAllUsers().pipe(
          map(users => UserReducer.loadUsersSuccess({ users })),
          catchError(error => of(UserReducer.loadUsersFailure({ error: error.message || 'Failed to load users' })))
        )
      )
    )
  );
}
