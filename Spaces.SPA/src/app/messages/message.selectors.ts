import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState } from './message.reducer';

export const selectMessageState = createFeatureSelector<MessageState>('messages');

export const selectAllMessages = createSelector(
  selectMessageState,
  (state) => state.allMessages
);

export const selectRecipientMessages = createSelector(
  selectMessageState,
  (state) => state.recipientMessages
);

export const selectUnreadMessagesCount = (userId: number) => createSelector(
  selectAllMessages,
  (messages) => messages.filter(m => m.recipientId === userId && !m.isRead).length
);

export const selectMessagesLoading = createSelector(
  selectMessageState,
  (state) => state.loading
);

export const selectMessagesError = createSelector(
  selectMessageState,
  (state) => state.error
);
