import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as MessageActions from './message.actions';
import { MessageHubService } from './message-hub.service';

@Injectable()
export class MessageEffects {
  actions$ = inject(Actions);
  messageHub = inject(MessageHubService);

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.sendMessage),
      switchMap(({ message }) =>
        from(this.messageHub.sendMessageToUser(message.recipientId, message)).pipe(
          map(() => MessageActions.sendMessageSuccess()),
          catchError(error => of(MessageActions.sendMessageFailure({ error: error.message })))
        )
      )
    )
  );
  
  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.loadMessages),
      mergeMap(({ userId, recipientId }) =>
        from(this.messageHub.requestMessagesWithRecipient(userId, recipientId)).pipe(
          map(() => ({ type: '[Message] Load Messages Requested' })), // No-op, actual messages come via SignalR
          catchError(error => of(MessageActions.loadMessagesFailure({ error: error.message })))
        )
      )
    )
  );
}
