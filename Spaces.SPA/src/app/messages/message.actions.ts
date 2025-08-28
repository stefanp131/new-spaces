
import { createAction, props } from '@ngrx/store';
import { Message } from './message.model';

// Load all messages (for all recipients)
export const loadAllMessages = createAction('[Message] Load All Messages', props<{ userId: number }>());
export const loadAllMessagesSuccess = createAction('[Message] Load All Messages Success', props<{ messages: Message[] }>());
export const loadAllMessagesFailure = createAction('[Message] Load All Messages Failure', props<{ error: string }>());

export const loadMessages = createAction('[Message] Load Messages', props<{ userId: number, recipientId: number }>());
export const loadMessagesSuccess = createAction('[Message] Load Messages Success', props<{ messages: Message[] }>());
export const loadMessagesFailure = createAction('[Message] Load Messages Failure', props<{ error: string }>());

export const sendMessage = createAction('[Message] Send Message', props<{ message: Message }>());
export const sendMessageSuccess = createAction('[Message] Send Message Success');
export const sendMessageFailure = createAction('[Message] Send Message Failure', props<{ error: string }>());
export const markAllAsRead = createAction('[Message] Mark All As Read', props<{ userId: number, recipientId: number }>());
export const markAllAsReadSuccess = createAction('[Message] Mark All As Read Success', props<{ recipientId: number }>());
export const markAllAsReadFailure = createAction('[Message] Mark All As Read Failure', props<{ error: string }>());

// SignalR: Receive a single message
export const receiveMessage = createAction('[Message] Receive Message', props<{ message: Message }>());
