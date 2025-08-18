import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService, Post } from './post.service';

import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material.module';
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
			MaterialModule,
			QuillModule,
			DatePipe
		]
})
export class HomeComponent implements OnInit {
	postForm: FormGroup;
	posts: Post[] = [];

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private postService: PostService
	) {
		this.postForm = this.fb.group({
			title: ['', Validators.required],
			content: ['', Validators.required]
		});
	}

	ngOnInit() {
		this.loadPosts();
	}

	createPost() {
		if (this.postForm.invalid) return;
		this.postService.createPost(this.postForm.value).subscribe({
			next: (post) => {
				this.posts.unshift(post);
				this.postForm.reset();
			}
		});
	}

	loadPosts() {
		this.postService.getPosts().subscribe(posts => {
			this.posts = posts.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
		});
	}

	logout() {
		localStorage.removeItem('jwt');
		this.router.navigate(['/login']);
	}
}
