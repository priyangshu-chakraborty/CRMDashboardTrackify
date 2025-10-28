import { Component, inject } from '@angular/core';
import { NotificationsService, EmailNotification } from './notifications.service';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-notifications-list',
  imports: [RouterLink, NgIf, NgFor, FormsModule, DatePipe],
  template: `
  <div class="card">
    <div class="actions" style="justify-content:space-between;align-items:center">
      <h2>Notifications</h2>
      <div class="filters">
        <select class="select" [(ngModel)]="statusFilter" (change)="load()">
          <option value="">All</option>
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
        <a routerLink="/notifications/new" class="btn" *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])">New notification</a>
      </div>
    </div>

    <table class="table" *ngIf="items.length; else empty">
      <thead><tr><th>Task</th><th>User</th><th>Status</th><th>Sent Time</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let n of items">
          <td>{{ n.taskDescription }}</td>
          <td>{{ n.username }}</td>
          <td>{{ n.status }}</td>
          <td>{{ n.sentTime | date:'medium' }}</td>
          <td class="actions">
            <button class="btn danger" (click)="delete(n.notificationId!)" *ngIf="auth.hasRole(['ROLE_ADMIN'])">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <ng-template #empty><p>No notifications found.</p></ng-template>
  </div>
  `
})
export class NotificationsListComponent {
  svc = inject(NotificationsService);
  auth = inject(AuthService);
  items: EmailNotification[] = [];
  statusFilter = '';
  statuses = ['SENT', 'DELIVERED', 'FAILED', 'PENDING'];

  constructor() { this.load(); }
  load() {
    const req = this.statusFilter ? this.svc.byStatus(this.statusFilter) : this.svc.list();
    req.subscribe(n => this.items = n);
  }
  delete(id: number) {
    if (!confirm('Delete this notification?')) return;
    this.svc.remove(id).subscribe(() => this.load());
  }
}
