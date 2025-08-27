import { createAction, props } from '@ngrx/store';
import { Post } from './post.model';

export const loadPosts = createAction('[Post] Load Posts');
export const loadPostsSuccess = createAction('[Post] Load Posts Success', props<{ posts: Post[] }>());
export const loadPostsFailure = createAction('[Post] Load Posts Failure', props<{ error: string }>());
export const loadPostsByUser = createAction('[Post] Load Posts By User', props<{ userId: string }>());

export const createPost = createAction('[Post] Create Post', props<{ post: Partial<Post> }>());
export const createPostSuccess = createAction('[Post] Create Post Success', props<{ post: Post }>());
export const createPostFailure = createAction('[Post] Create Post Failure', props<{ error: string }>());

export const deletePost = createAction('[Post] Delete Post', props<{ id: string }>());
export const deletePostSuccess = createAction('[Post] Delete Post Success', props<{ id: string }>());
export const deletePostFailure = createAction('[Post] Delete Post Failure', props<{ error: string }>());
