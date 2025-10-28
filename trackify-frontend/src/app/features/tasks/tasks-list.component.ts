import { Component, inject } from '@angular/core';
import { TasksService, Task, TaskStatus } from './tasks.service';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-tasks-list',
  imports: [RouterLink, NgIf, NgFor, FormsModule, DatePipe],
  template: `
  <div class="card">
    <div class="actions" style="justify-content:space-between;align-items:center">
      <h2>Tasks</h2>
      <div class="filters">
        <select class="select" [(ngModel)]="statusFilter" (change)="load()">
          <option value="">All</option>
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
        <a *ngIf="auth.hasRole(['ROLE_MANAGER','ROLE_ADMIN'])" routerLink="/tasks/new" class="btn">New task</a>
      </div>
    </div>

    <table class="table" *ngIf="tasks.length; else empty">
      <thead><tr><th>Description</th><th>Status</th><th>Due Date</th><th>Deal</th><th>Assigned To</th><th>Created</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let t of tasks">
          <td>{{ t.description }}</td>
          <td>{{ t.status }}</td>
          <td>{{ t.dueDate || '-' }}</td>
          <td>{{ t.dealName || '-' }}</td>
          <td>{{ t.assignedTo || '-' }}</td>
          <td>{{ t.createdAt | date:'short' }}</td>
          <td class="actions">
            <a *ngIf="auth.hasRole(['ROLE_SALES','ROLE_MANAGER','ROLE_ADMIN'])" [routerLink]="['/tasks', t.taskId, 'edit']" class="btn secondary">Update</a>
            <button *ngIf="auth.hasRole(['ROLE_ADMIN'])" class="btn danger" (click)="delete(t.taskId!)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <ng-template #empty><p>No tasks found.</p></ng-template>
  </div>
  `
})
export class TasksListComponent {
  svc = inject(TasksService);
  auth = inject(AuthService);
  tasks: Task[] = [];
  statusFilter = '';
  statuses: TaskStatus[] = ['Pending','Completed'];

  constructor() { this.load(); }
  load() {
    const req = this.statusFilter ? this.svc.byStatus(this.statusFilter as TaskStatus) : this.svc.list();
    req.subscribe(t => this.tasks = t);
  }
  delete(id: number) {
    if (!confirm('Delete this task?')) return;
    this.svc.remove(id).subscribe(() => this.load());
  }
}
