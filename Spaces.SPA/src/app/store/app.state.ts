import { AuthState } from '../auth/auth.state';
import { PostState } from '../home/post.state';

export interface AppState {
  auth: AuthState;
  posts: PostState;
}
