import { Component, inject } from '@angular/core';
import { DealsService, Deal, DealStage } from './deals.service';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-deals-list',
  imports: [RouterLink, NgIf, NgFor, FormsModule, DatePipe],
  template: `
  <div class="card">
    <div class="actions" style="justify-content:space-between;align-items:center">
      <h2>Deals</h2>
      <div class="filters">
        <select class="select" [(ngModel)]="stageFilter" (change)="load()">
          <option value="">All stages</option>
          <option *ngFor="let s of stages" [value]="s">{{ s }}</option>
        </select>
        <a *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])" routerLink="/deals/new" class="btn">New deal</a>
      </div>
    </div>

    <table class="table" *ngIf="deals.length; else empty">
      <thead><tr><th>Deal Name</th><th>Amount</th><th>Stage</th><th>Customer</th><th>Assigned To</th><th>Created</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let d of deals">
          <td>{{ d.dealName }}</td>
          <td>₹ {{ d.amount }}</td>
          <td>{{ d.stage }}</td>
          <td>{{ d.customerName || '-' }}</td>
          <td>{{ d.assignedTo || '-' }}</td>
          <td>{{ d.createdAt | date:'short' }}</td>
          <td class="actions">
            <a *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])" [routerLink]="['/deals', d.dealId, 'edit']" class="btn secondary">Edit</a>
            <button *ngIf="auth.hasRole(['ROLE_ADMIN'])" class="btn danger" (click)="delete(d.dealId!)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <ng-template #empty><p>No deals found.</p></ng-template>
  </div>
  `
})
export class DealsListComponent {
  svc = inject(DealsService);
  auth = inject(AuthService);
  deals: Deal[] = [];
  stageFilter = '';
  stages: DealStage[] = ['Proposal', 'Lead', 'Closed Lost', 'Closed Won'];

  constructor() { this.load(); }
  load() {
    const req = this.stageFilter ? this.svc.byStage(this.stageFilter as DealStage) : this.svc.list();
    req.subscribe(d => this.deals = d);
  }
  delete(id: number) {
    if (!confirm('Delete this deal?')) return;
    this.svc.remove(id).subscribe(() => this.load());
  }
}
