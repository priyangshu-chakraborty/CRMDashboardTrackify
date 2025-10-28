import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
  <nav class="navbar">
    <div class="nav-left">
      <a routerLink="/" class="brand">🚀 <b>Trackify</b></a>
      <a routerLink="/dashboard/sales">📊 <b>Sales</b></a>
      <a *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])" routerLink="/dashboard/manager">📈 <b>Manager</b></a>
      <a *ngIf="auth.hasRole(['ROLE_ADMIN'])" routerLink="/dashboard/admin">🛠️ <b>Admin</b></a>
      <a routerLink="/customers">👥 <b>Customers</b></a>
      <a routerLink="/deals">💼 <b>Deals</b></a>
      <a routerLink="/tasks">✅ <b>Tasks</b></a>
      <a *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])" routerLink="/notifications">🔔 <b>Notifications</b></a>
      <a *ngIf="auth.hasRole(['ROLE_ADMIN'])" routerLink="/users">👤 <b>Users</b></a>
    </div>
    <div class="nav-right" *ngIf="auth.currentUser as user; else guest">
      <span class="user">🙍 <b>{{ user.username }}</b></span>
      <button class="btn btn-outline" (click)="auth.logout()">🚪 <b>Logout</b></button>
    </div>
    <ng-template #guest>
      <div class="nav-right">
        <a routerLink="/login" class="btn" (click)="onLinkClick($event, '/login')">🔑 <b>Login</b></a>
        <a routerLink="/register" class="btn btn-outline" (click)="onLinkClick($event, '/register')">📝 <b>Register</b></a>
      </div>
    </ng-template>
  </nav>
  `,
  styles: [`
    .navbar {
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:0.75rem 1rem;
      background:#0f172a;
      color:#fff;
    }
    .nav-left a {
      margin-right:1rem;
      color:#cbd5e1;
      text-decoration:none;
      font-weight:600; /* makes text bold */
    }
    .nav-left a:hover { color:#fff }
    .brand { font-weight:700; color:#fff }
    .user { margin-right:0.75rem; font-weight:600 }
    .btn {
      background:#22c55e;
      color:#0f172a;
      border:none;
      padding:0.4rem 0.75rem;
      border-radius:6px;
      cursor:pointer;
      font-weight:600;
    }
    .btn-outline {
      background:transparent;
      color:#fff;
      border:1px solid #334155;
      font-weight:600;
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);

  onLinkClick(event: Event, path: string) {
    console.log('Navbar link clicked', path, event);
  }
}
