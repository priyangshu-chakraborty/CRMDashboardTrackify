import { Component, inject } from '@angular/core';
import { CustomersService, Customer } from './customers.service';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-customers-list',
  imports: [RouterLink, NgIf, NgFor],
  template: `
  <div class="card">
    <div class="actions" style="justify-content:space-between;align-items:center">
      <h2>Customers</h2>
      <a *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])" 
         routerLink="/customers/new" 
         class="btn">New customer</a>
    </div>

    <table class="table" *ngIf="customers.length; else empty">
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let c of customers">
          <td>{{ c.name }}</td>
          <td>{{ c.email || '-' }}</td>
          <td>{{ c.phone || '-' }}</td>
          <td>{{ c.company || '-' }}</td>
          <td class="actions">
            <a *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])" 
               [routerLink]="['/customers', c.customerId, 'edit']" 
               class="btn secondary">Edit</a>

            <button *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])"
                    (click)="deleteCustomer(c.customerId!)"
                    class="btn danger">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <ng-template #empty><p>No customers yet.</p></ng-template>
  </div>
  `
})
export class CustomersListComponent {
  svc = inject(CustomersService);
  auth = inject(AuthService);
  customers: Customer[] = [];

  constructor() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.svc.list().subscribe(c => this.customers = c);
  }

  deleteCustomer(customerId: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.svc.remove(customerId).subscribe(() => {
        // filter out deleted customer from local array
        this.customers = this.customers.filter(c => c.customerId !== customerId);
      });
    }
  }
}
