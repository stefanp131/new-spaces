import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtUtilsService {
  static getUserId(): number | null {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload);
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ? +payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] : null;
    } catch {
      return null;
    }
  }
}
