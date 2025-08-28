import { createReducer, on } from '@ngrx/store';
import * as MessageActions from './message.actions';
import { Message } from './message.model';

export interface MessageState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
};

export const messageReducer = createReducer(
  initialState,
  on(MessageActions.loadMessages, (state) => ({ ...state, loading: true, error: null })),
  on(MessageActions.loadMessagesSuccess, (state, { messages }) => ({ ...state, loading: false, messages })),
  on(MessageActions.loadMessagesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(MessageActions.sendMessage, (state) => ({ ...state, loading: true, error: null })),
  on(MessageActions.sendMessageSuccess, (state) => ({ ...state, loading: false })),
  on(MessageActions.sendMessageFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(MessageActions.markAllAsRead, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MessageActions.markAllAsReadSuccess, (state) => ({
    ...state,
    loading: false,
    messages: state.messages.map(m => ({ ...m, isRead: true }))
  })),
  on(MessageActions.markAllAsReadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Add new message to the top of the list when received via SignalR
  on(MessageActions.receiveMessage, (state, { message }) => ({
    ...state,
    messages: [message, ...state.messages]
  })),
);
