import { createAction, props } from '@ngrx/store';
import { Message } from './message.model';

export const loadMessages = createAction('[Message] Load Messages', props<{ userId: number }>());
export const loadMessagesSuccess = createAction('[Message] Load Messages Success', props<{ messages: Message[] }>());
export const loadMessagesFailure = createAction('[Message] Load Messages Failure', props<{ error: string }>());

export const sendMessage = createAction('[Message] Send Message', props<{ message: Message }>());
export const sendMessageSuccess = createAction('[Message] Send Message Success');
export const sendMessageFailure = createAction('[Message] Send Message Failure', props<{ error: string }>());
export const markAllAsRead = createAction('[Message] Mark All As Read');
export const markAllAsReadSuccess = createAction('[Message] Mark All As Read Success');
export const markAllAsReadFailure = createAction('[Message] Mark All As Read Failure', props<{ error: string }>());

// SignalR: Receive a single message
export const receiveMessage = createAction('[Message] Receive Message', props<{ message: Message }>());
