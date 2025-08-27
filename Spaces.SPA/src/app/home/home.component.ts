import { jwtDecode } from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Post } from './post.model';
import * as PostActions from './post.actions';
import * as PostSelectors from './post.selectors';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
    MatSnackBarModule,
    QuillModule,
    DatePipe,
  ],
})
export class HomeComponent implements OnInit {
  postForm: FormGroup;
  posts$: Observable<Post[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
    this.posts$ = this.store.select(PostSelectors.selectAllPosts);
    this.loading$ = this.store.select(PostSelectors.selectPostsLoading);
    this.error$ = this.store.select(PostSelectors.selectPostsError);
  }

  ngOnInit() {
    const token = localStorage.getItem('jwt');
    let userId: string | undefined;
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        userId = decoded['nameid'] || decoded['sub'] || decoded['userId'] || decoded['userid'];
      } catch (e) {
        userId = undefined;
      }
    }
    if (userId) {
      this.store.dispatch(PostActions.loadPostsByUser({ userId }));
    }
  }

  createPost() {
    if (this.postForm.invalid) return;
    this.store.dispatch(PostActions.createPost({ post: this.postForm.value }));
    this.postForm.reset();
  }

  deletePost(post: Post) {
    if (!post.id) return;
    this.store.dispatch(PostActions.deletePost({ id: post.id }));
    this.snackBar.open('Post deleted', 'Close', { duration: 2500, panelClass: 'snackbar-accent' });
  }

  logout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
