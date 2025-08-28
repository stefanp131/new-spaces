import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from '../auth/auth.reducer';
import { postReducer } from '../home/post.reducer';
import { messageReducer } from '../messages/message.reducer';
import { userReducer } from '../users/user.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  auth: authReducer,
  posts: postReducer,
  messages: messageReducer,
  users: userReducer,
};
