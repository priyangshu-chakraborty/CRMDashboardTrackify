import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf],
  template: `
  <div class="card" style="max-width:400px;margin:2rem auto">
    <h2>Register</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="form">
      <label class="label">Email</label>
      <input class="input" formControlName="email" type="email" />
      <label class="label">Password</label>
      <input class="input" formControlName="password" type="password" />
      <div class="actions">
        <button class="btn" type="submit" [disabled]="form.invalid || loading">Create account</button>
      </div>
      <p *ngIf="error" style="color:#ef4444">{{ error }}</p>
    </form>
  </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    this.auth.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => { this.error = e?.error?.message || 'Registration failed'; this.loading = false; }
    });
  }
}
