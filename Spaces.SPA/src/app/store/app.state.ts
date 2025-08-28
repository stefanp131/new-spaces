import { AuthState } from '../auth/auth.state';
import { PostState } from '../home/post.state';
import { MessageState } from '../messages/message.reducer';
import { UserState } from '../users/user.reducer';

export interface AppState {
  auth: AuthState;
  posts: PostState;
  messages: MessageState;
  users: UserState;
}
