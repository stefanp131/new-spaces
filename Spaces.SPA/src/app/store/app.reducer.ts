import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from '../auth/auth.reducer';
import { postReducer } from '../home/post.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  auth: authReducer,
  posts: postReducer,
};
