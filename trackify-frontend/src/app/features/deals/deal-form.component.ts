import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DealsService, DealStage } from './deals.service';
import { NgFor, NgIf } from '@angular/common';
import { CustomersService } from '../customers/customers.service';
import { UsersService } from '../users/users.service';

@Component({
  standalone: true,
  selector: 'app-deal-form',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  template: `
  <div class="card">
    <h2>{{ isEdit ? 'Edit deal' : 'New deal' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()" class="form">
      <label class="label">Deal Name</label>
      <input class="input" formControlName="dealName">
      <label class="label">Amount</label>
      <input class="input" formControlName="amount" type="number">
      <label class="label">Stage</label>
      <select class="select" formControlName="stage">
        <option *ngFor="let s of stages" [value]="s">{{ s }}</option>
      </select>
      <label class="label">Customer Name</label>
      <select class="select" formControlName="customerName">
        <option value="">Select a customer</option>
        <option *ngFor="let c of customers" [value]="c.name">{{ c.name }}</option>
      </select>

      <label class="label">Assign To</label>
      <select class="select" formControlName="assignedTo">
        <option value="">Select a user</option>
        <option *ngFor="let u of users" [value]="u.username">{{ u.username }}</option>
      </select>

      <div class="actions">
        <button class="btn" type="submit" [disabled]="form.invalid || loading">Save</button>
        <button class="btn outline" type="button" (click)="router.navigate(['/deals'])">Cancel</button>
      </div>
      <p *ngIf="error" style="color:#ef4444">{{ error }}</p>
    </form>
  </div>
  `
})
export class DealFormComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  svc = inject(DealsService);
  isEdit = !!this.route.snapshot.paramMap.get('id');
  loading = false;
  error = '';
  stages: DealStage[] = ['Proposal', 'Lead', 'Closed Lost', 'Closed Won'];

  customers: any[] = [];
  users: any[] = [];

  form = this.fb.group({
    dealName: ['', Validators.required],
    amount: [0, Validators.min(0)],
    stage: ['Lead', Validators.required],
    customerName: ['', Validators.required],
    assignedTo: ['', Validators.required],
  });

  constructor() {
    const customersSvc = inject(CustomersService);
    const usersSvc = inject(UsersService);

    // load customers and users for dropdowns
    customersSvc.list().subscribe({ next: c => this.customers = c, error: e => console.error('customers load error', e) });
    usersSvc.list().subscribe({ next: u => this.users = u, error: e => console.error('users load error', e) });

    if (this.isEdit) {
      const dealId = Number(this.route.snapshot.paramMap.get('id'));
      this.svc.get(dealId).subscribe(d => this.form.patchValue(d));
    }
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    const dealId = Number(this.route.snapshot.paramMap.get('id'));
    const payload = this.form.value as any;
    const req = this.isEdit ? this.svc.update(dealId, payload) : this.svc.create(payload);
    req.subscribe({
      next: () => this.router.navigate(['/deals']),
      error: e => { this.error = e?.error?.message || 'Save failed'; this.loading = false; }
    });
  }
}
