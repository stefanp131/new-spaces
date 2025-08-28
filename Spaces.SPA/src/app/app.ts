import { Component, signal, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MessageHubService } from './messages/message-hub.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { selectUser } from './auth/auth.selectors';
import { JwtUtilsService } from './utils/jwt-utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Spaces.SPA');

  constructor() {
  }

}
