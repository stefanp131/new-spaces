import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState } from './message.reducer';

export const selectMessageState = createFeatureSelector<MessageState>('messages');

export const selectAllMessages = createSelector(
  selectMessageState,
  (state) => state.messages
);

export const selectUnreadMessagesCount = createSelector(
  selectAllMessages,
  (messages) => messages.filter(m => !m.isRead).length
);

export const selectMessagesLoading = createSelector(
  selectMessageState,
  (state) => state.loading
);

export const selectMessagesError = createSelector(
  selectMessageState,
  (state) => state.error
);
