import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostState } from './post.state';

export const selectPostState = createFeatureSelector<PostState>('posts');
export const selectAllPosts = createSelector(selectPostState, (state) => state.posts);
export const selectPostsLoading = createSelector(selectPostState, (state) => state.loading);
export const selectPostsError = createSelector(selectPostState, (state) => state.error);
