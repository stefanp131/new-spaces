import { createReducer, on } from '@ngrx/store';
import * as PostActions from './post.actions';
import { PostState } from './post.state';

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

export const postReducer = createReducer(
  initialState,
  on(PostActions.loadPostsByUser, (state) => ({ ...state, loading: true, error: null })),
  on(PostActions.loadPostsSuccess, (state, { posts }) => ({ ...state, posts, loading: false })),
  on(PostActions.loadPostsFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(PostActions.createPost, (state) => ({ ...state, loading: true })),
  on(PostActions.createPostSuccess, (state, { post }) => ({ ...state, posts: [post, ...state.posts], loading: false })),
  on(PostActions.createPostFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(PostActions.deletePost, (state) => ({ ...state, loading: true })),
  on(PostActions.deletePostSuccess, (state, { id }) => ({ ...state, posts: state.posts.filter(p => p.id !== id), loading: false })),
  on(PostActions.deletePostFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
