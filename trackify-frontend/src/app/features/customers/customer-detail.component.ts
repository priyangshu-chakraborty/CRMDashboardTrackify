import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomersService, Customer } from './customers.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-customer-detail',
  imports: [RouterLink, NgIf],
  template: `
  <div class="card" *ngIf="customer">
    <h2>{{ customer.name }}</h2>
    <p>Email: {{ customer.email || '-' }}</p>
    <p>Phone: {{ customer.phone || '-' }}</p>
    <p>Company: {{ customer.company || '-' }}</p>
    <p>Notes: {{ customer.notes || '-' }}</p>
    <div class="actions">
      <a routerLink="/customers" class="btn outline">Back</a>
      <a *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])" [routerLink]="['/customers', customer.customerId, 'edit']" class="btn secondary">Edit</a>
    </div>
  </div>
  `
})
export class CustomerDetailComponent {
  route = inject(ActivatedRoute);
  svc = inject(CustomersService);
  auth = inject(AuthService);
  customer?: Customer;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.get(id).subscribe(c => this.customer = c);
  }
}
