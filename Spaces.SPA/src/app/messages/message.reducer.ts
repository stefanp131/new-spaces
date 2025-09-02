import { createReducer, on } from '@ngrx/store';
import * as MessageActions from './message.actions';
import { Message } from './message.model';

export interface MessageState {
  allMessages: Message[];
  recipientMessages: Message[];
  loading: boolean;
  error: string | null;
}

export const initialState: MessageState = {
  allMessages: [],
  recipientMessages: [],
  loading: false,
  error: null,
};

export const messageReducer = createReducer(
  initialState,
  on(MessageActions.loadMessages, (state) => ({ ...state, loading: true, error: null })),
  // For recipient-specific messages
  on(MessageActions.loadMessagesSuccess, (state, { messages }) => ({ ...state, loading: false, recipientMessages: messages })),
  // For all messages
  on(MessageActions.loadAllMessagesSuccess, (state, { messages }) => ({ ...state, loading: false, allMessages: messages })),
  on(MessageActions.loadMessagesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(MessageActions.sendMessage, (state) => ({ ...state, loading: true, error: null })),
  on(MessageActions.sendMessageSuccess, (state) => ({ ...state, loading: false })),
  on(MessageActions.sendMessageFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(MessageActions.markAllAsRead, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MessageActions.markAllAsReadSuccess, (state, { recipientId }) => ({
    ...state,
    loading: false,
    allMessages: state.allMessages.map(m => 
      m.recipientId === recipientId ? { ...m, isRead: true } : m
    ),
    recipientMessages: state.recipientMessages.map(m => 
      m.recipientId === recipientId ? { ...m, isRead: true } : m
    )
  })),
  on(MessageActions.markAllAsReadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Add new message to the top of the list when received via SignalR
  on(MessageActions.receiveMessage, (state, { message }) => ({
    ...state,
    recipientMessages: [{ ...message, isRead: false }, ...state.recipientMessages],
    allMessages: [{ ...message, isRead: false }, ...state.allMessages]
  })),
);
