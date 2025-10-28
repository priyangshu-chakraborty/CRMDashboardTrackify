import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from './customers.service';
import { UsersService } from '../users/users.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  template: `
  <div class="card">
    <h2>{{ isEdit ? 'Edit customer' : 'New customer' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()" class="form">
      <label class="label">Name *</label>
      <input class="input" formControlName="name">
      <label class="label">Email *</label>
      <input class="input" formControlName="email" type="email">
      <label class="label">Phone *</label>
      <input class="input" formControlName="phone">
      <label class="label">Company *</label>
      <input class="input" formControlName="company">
      <label class="label">Address *</label>
      <textarea class="textarea" formControlName="address"></textarea>
      <label class="label">Created By</label>
      <select class="select" formControlName="createdBy">
        <option value="">Select an admin</option>
        <option *ngFor="let admin of adminUsers" [value]="admin.username">
          {{ admin.username }}
        </option>
      </select>

      <div class="actions">
        <button class="btn" type="submit" [disabled]="form.invalid || loading">Save</button>
        <button class="btn outline" type="button" (click)="router.navigate(['/customers'])">Cancel</button>
      </div>
      <p *ngIf="error" style="color:#ef4444">{{ error }}</p>
    </form>
  </div>
  `
})
export class CustomerFormComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  svc = inject(CustomersService);
  usersService = inject(UsersService);
  
  isEdit = !!this.route.snapshot.paramMap.get('id');
  loading = false;
  error = '';
  adminUsers: any[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    company: ['', Validators.required],
    address: ['', Validators.required],
    createdBy: [''],
    createdAt: [new Date().toISOString()]
  });

  constructor() {
    // Load admin users
    this.usersService.list().subscribe({
      next: (users) => {
        this.adminUsers = users.filter(user => user.roles.includes('ROLE_ADMIN'));
        console.log('Loaded admin users:', this.adminUsers); // Debug log
      },
      error: (err) => {
        console.error('Error loading admin users:', err);
        this.error = 'Failed to load admin users';
      }
    });

    if (this.isEdit) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.loading = true;
      // No single-customer endpoint available; use list() and find the record
      this.svc.list().subscribe({
        next: (all) => {
          const customer = all.find(c => c.customerId === id);
          if (customer) {
            this.form.patchValue(customer);
          } else {
            this.error = 'Customer not found';
          }
          this.loading = false;
        },
        error: (e: any) => {
          this.error = e?.error?.message || 'Failed to load customers';
          this.loading = false;
        }
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.error = 'Please fill in all required fields';
      return;
    }
    this.loading = true; this.error = '';
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const payload = this.form.value as any;
    const req = this.isEdit ? this.svc.update(id, payload) : this.svc.create(payload);
    req.subscribe({
      next: () => this.router.navigate(['/customers']),
      error: e => { this.error = e?.error?.message || 'Save failed'; this.loading = false; }
    });
  }
}
