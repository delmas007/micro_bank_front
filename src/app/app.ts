import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { AuthService } from './auth/services/auth';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth-module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, AuthModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'micro-front';
  public authenticated = false;

  constructor(private readonly authService: AuthService) {}

  public ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
  }
}
