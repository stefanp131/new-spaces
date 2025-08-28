import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Message } from './message.model';
import * as MessageSelectors from './message.selectors';
import * as MessageActions from './message.actions';
// Update the path below to the correct location of user.selectors
import { JwtUtilsService } from '../utils/jwt-utils.service';
// TODO: Update the path below to the actual location of your user.selectors.ts file
import * as UserSelectors from '../users/user.reducer';
import { CommonModule } from '@angular/common';

// Define UserDropdown type if not imported from elsewhere
export interface UserDropdown {
  id: number;
  username: string;
}

@Component({
  selector: 'app-messages-page',
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class MessagesPageComponent implements OnInit {
  messages$: Observable<Message[]>;
  users$: Observable<UserDropdown[]>;
  messageForm: FormGroup;
  userId: number;
  users: UserDropdown[] = [];
  private usersSub?: Subscription;

  constructor(private store: Store, private fb: FormBuilder) {
    this.messages$ = this.store.select(MessageSelectors.selectAllMessages);
    this.users$ = this.store.select(UserSelectors.selectAllUsers);
    this.messageForm = this.fb.group({
      recipientId: ['', Validators.required],
      content: ['', Validators.required],
    });
    this.userId = JwtUtilsService.getUserId() ?? 0;
  }

  ngOnInit() {
    this.store.dispatch({ type: '[User] Load Users' });
    this.usersSub = this.users$.subscribe((users) => (this.users = users));
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
    this.messageForm.reset();
  }
  getSenderUsername(senderId: number, users: UserDropdown[]): string {
    const user = users.find((u) => u.id === senderId);
    return user ? user.username : senderId.toString();
  }
}
