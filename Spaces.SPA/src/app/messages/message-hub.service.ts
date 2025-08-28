import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { from, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as MessageActions from './message.actions';
import { Message } from './message.model';

@Injectable({ providedIn: 'root' })
export class MessageHubService {
  private hubConnection: HubConnection | null = null;
  private messageReceivedSource = new Subject<Message>();
  messageReceived$ = this.messageReceivedSource.asObservable();
  private store: Store;
  private connectionStarted: Promise<void> = Promise.resolve();

  constructor(store: Store) {
    this.store = store;
  }

  start(userId: number) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5170/hubs/message', {
        accessTokenFactory: () => localStorage.getItem('jwt') || '',
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.messageReceivedSource.next(message);
      this.store.dispatch(MessageActions.receiveMessage({ message }));
    });

    this.hubConnection.on('ReceiveAllMessages', (messages: Message[]) => {
      this.store.dispatch(MessageActions.loadMessagesSuccess({ messages }));
    });

    this.connectionStarted = this.hubConnection
      .start()
      .then(() => {
        this.hubConnection?.invoke('RequestAllMessages', userId);
      })
      .catch((err) => console.error('SignalR error:', err));
  }

  async sendMessageToUser(recipientId: number, message: Message): Promise<void> {
    await this.connectionStarted;
    if (!this.hubConnection) throw new Error('SignalR connection not started');
    return this.hubConnection.invoke('SendMessageToUser', recipientId, message).catch((err) => {
      console.error('Invoke error:', err);
      throw err;
    });
  }

  stop() {
    this.hubConnection?.stop();
  }
}
