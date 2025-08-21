import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from './post.service';
import * as PostActions from './post.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class PostEffects {
  actions$ = inject(Actions);
  postService = inject(PostService);
  
  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPosts),
      mergeMap(() =>
        this.postService.getPosts().pipe(
          map((posts) => PostActions.loadPostsSuccess({ posts })),
          catchError((error) =>
            of(PostActions.loadPostsFailure({ error: error.message || 'Load failed' }))
          )
        )
      )
    )
  );

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.createPost),
      mergeMap(({ post }) => {
        // Ensure all required fields are present for Post
        const safePost: any = {
          id: post.id ?? '',
          title: post.title ?? '',
          content: post.content ?? '',
          createdAt: post.createdAt ?? new Date().toISOString(),
        };
        if ('userId' in post) {
          safePost.userId = post.userId;
        }
        return this.postService.createPost(safePost).pipe(
          map((newPost) => PostActions.createPostSuccess({ post: newPost })),
          catchError((error) =>
            of(PostActions.createPostFailure({ error: error.message || 'Create failed' }))
          )
        );
      })
    )
  );

  deletePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.deletePost),
      mergeMap(({ id }) =>
        this.postService.deletePost(id).pipe(
          map(() => PostActions.deletePostSuccess({ id })),
          catchError((error) =>
            of(PostActions.deletePostFailure({ error: error.message || 'Delete failed' }))
          )
        )
      )
    )
  );
}
