import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-navbar',
	standalone: true,
		imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule],
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
	constructor(public router: Router) {}

	isLoggedIn(): boolean {
		return !!localStorage.getItem('jwt');
	}

	logout() {
		localStorage.removeItem('jwt');
		this.router.navigate(['/login']);
	}
}
