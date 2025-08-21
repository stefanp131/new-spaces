import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	constructor(public router: Router, public themeService: ThemeService) {}

	ngOnInit() {
		this.themeService.initTheme();
	}

	toggleTheme() {
		this.themeService.toggleTheme();
	}

	isLoggedIn(): boolean {
		return !!localStorage.getItem('jwt');
	}

	logout() {
		localStorage.removeItem('jwt');
		this.router.navigate(['/login']);
	}
}
