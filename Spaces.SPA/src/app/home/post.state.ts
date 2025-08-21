import { Post } from './post.model';

export interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}
