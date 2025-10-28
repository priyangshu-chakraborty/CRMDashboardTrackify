import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, JsonPipe } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
  <div class="card" style="max-width:400px;margin:2rem auto">
    <h2>Login</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="form">
      <label class="label">Username</label>
      <input class="input" formControlName="username" type="text" />
      <label class="label">Password</label>
      <input class="input" formControlName="password" type="password" />
      <div class="actions">
        <!-- add a click fallback in case form submit isn't firing -->
        <button class="btn" type="submit" (click)="submit()" [disabled]="form.invalid || loading">Login</button>
        <a routerLink="/register" class="btn outline">Register</a>
      </div>
      <p *ngIf="error" style="color:#ef4444">{{ error }}</p>
      <!-- debug: show current form value -->
      <!-- <pre style="margin-top:1rem;color:#334155">{{ form.value | json }}</pre> -->
    </form>
  </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  loading = false;
  error = '';

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submit() {
  // if (this.form.invalid) return;
  this.loading = true; this.error = '';
  this.auth.login(this.form.value as any).subscribe({
    next: () => this.router.navigate(['/']),
    error: (e) => { this.error = e?.error?.message || 'Login failed'; this.loading = false; }
  });
}
}
