import { Routes } from '@angular/router';


import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

function authGuard() {
	const router = inject(Router);
	if (!localStorage.getItem('jwt')) {
		router.navigate(['/login']);
		return false;
	}
	return true;
}


export const routes: Routes = [
	{ path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), canActivate: [authGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'messages', loadComponent: () => import('./messages/messages-page.component').then(m => m.MessagesPageComponent), canActivate: [authGuard] },
	{ path: '**', redirectTo: '' }
];
