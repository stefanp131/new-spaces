import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Message } from './message.model';
import * as MessageSelectors from './message.selectors';
import * as MessageActions from './message.actions';
import { JwtUtilsService } from '../utils/jwt-utils.service';
import { MessageHubService } from './message-hub.service';
import * as UserSelectors from '../users/user.reducer';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';


export interface UserDropdown {
  id: number;
  username: string;
}

export interface UserWithUnread extends UserDropdown {
  unreadCount: number;
}

@Component({
  selector: 'app-messages-page',
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.scss'],
  styles: [`
    .bold {
      font-weight: bold;
    }
    .unread-indicator {
      color: #f44336;
      font-size: 0.8em;
    }
  `],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatBadgeModule
  ],
  standalone: true,
})
export class MessagesPageComponent implements OnInit {
  messages$: Observable<Message[]>;
  filteredMessages$!: Observable<Message[]>;
  users$: Observable<UserDropdown[]>;
  usersWithUnread$!: Observable<UserWithUnread[]>;
  unreadMessagesCount$: Observable<number>;
  messageForm: FormGroup;
  userId: number;
  users: UserDropdown[] = [];
  private usersSub?: Subscription;

  constructor(private store: Store, private fb: FormBuilder, private messageHubService: MessageHubService) {
    this.messages$ = this.store.select(MessageSelectors.selectRecipientMessages);
    this.users$ = this.store.select(UserSelectors.selectAllUsers);
    this.messageForm = this.fb.group({
      recipientId: ['', Validators.required],
      content: ['', Validators.required],
    });
    this.userId = JwtUtilsService.getUserId() ?? 0;
    this.unreadMessagesCount$ = this.store.select(MessageSelectors.selectUnreadMessagesCount(this.userId));
  }


  ngOnInit() {
    this.store.dispatch({ type: '[User] Load Users' });
    this.usersSub = this.users$.subscribe((users: UserDropdown[]) => (this.users = users));

    // Ensure SignalR connection is (re)established after refresh
    if (!this.messageHubService['hubConnection'] || this.messageHubService['hubConnection'].state === 'Disconnected') {
      this.messageHubService.start(this.userId);
    }

    // Load all messages for the user on init
    this.store.dispatch(MessageActions.loadAllMessages({ userId: this.userId }));

    // Set up users with unread indicator
    this.usersWithUnread$ = combineLatest([this.users$, this.messages$]).pipe(
      map(([users, messages]) => 
        users.map(user => ({
          ...user,
          unreadCount: messages.filter(m => m.senderId === user.id && m.recipientId === this.userId && !m.isRead).length
        }))
      )
    );
  }

  reloadAllMessages() {
    this.store.dispatch(MessageActions.loadAllMessages({ userId: this.userId }));
  }

  sendMessage() {
    if (this.messageForm.invalid) return;
    const { recipientId, content } = this.messageForm.value;
    const message: Message = {
      senderId: this.userId,
      recipientId: +recipientId,
      content,
    };
    this.store.dispatch(MessageActions.sendMessage({ message }));
  }

  getSenderUsername(senderId: number, users: UserDropdown[]): string {
    const user = users.find((u) => u.id === senderId);
    return user ? user.username : senderId.toString();
  }

  onRecipientChange() {
    this.store.dispatch(MessageActions.markAllAsRead({ userId: JwtUtilsService.getUserId() ?? 0, recipientId: +this.messageForm.get('recipientId')!.value }));

    this.store.dispatch(
      MessageActions.loadMessages({ userId: JwtUtilsService.getUserId() ?? 0, recipientId: +this.messageForm.get('recipientId')!.value })
    );

    this.store.dispatch(
      MessageActions.loadAllMessages({ userId: JwtUtilsService.getUserId() ?? 0})
    );
  }
}
