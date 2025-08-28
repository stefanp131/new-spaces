import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDropdown } from './user.reducer';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5170/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDropdown[]> {
    return this.http.get<UserDropdown[]>(this.apiUrl);
  }
}
