
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId?: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = 'http://localhost:5170/api/posts';

  constructor(private http: HttpClient) {}

  getPostsByUser(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/${userId}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
