import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService, TaskStatus } from './tasks.service';
import { NgFor, NgIf } from '@angular/common';
import { UsersService } from '../users/users.service';
import { DealsService, Deal } from '../deals/deals.service';
import { User } from '../../core/types';

@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  template: `
  <div class="card">
    <h2>{{ isEdit ? 'Update task' : 'New task' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()" class="form">
      <label class="label">Description</label>
      <input class="input" formControlName="description">
      <label class="label">Status</label>
      <select class="select" formControlName="status">
        <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
      </select>
      <label class="label">Due date</label>
      <input class="input" formControlName="dueDate" type="date">
      <label class="label">Deal Name</label>
      <select class="input" formControlName="dealName">
        <option value="">Select a deal</option>
        <option *ngFor="let deal of deals" [value]="deal.dealName">{{ deal.dealName }}</option>
      </select>
      <label class="label">Assign To</label>
      <select class="input" formControlName="assignedTo">
        <option value="">Select a user</option>
        <option *ngFor="let user of users" [value]="user.username">{{ user.username }}</option>
      </select>

      <div class="actions">
        <button class="btn" type="submit" [disabled]="form.invalid || loading">Save</button>
        <button class="btn outline" type="button" (click)="router.navigate(['/tasks'])">Cancel</button>
      </div>
      <p *ngIf="error" style="color:#ef4444">{{ error }}</p>
    </form>
  </div>
  `
})
export class TaskFormComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  svc = inject(TasksService);
  usersService = inject(UsersService);
  dealsService = inject(DealsService);
  
  isEdit = !!this.route.snapshot.paramMap.get('id');
  loading = false;
  error = '';
  statuses: TaskStatus[] = ['Pending','Completed'];
  users: User[] = [];
  deals: Deal[] = [];

  constructor() {
    this.loadUsers();
    this.loadDeals();
    if (this.isEdit) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.loading = true;
      // TasksService does not expose a single-get method; fetch list and find the task by id
      this.svc.list().subscribe({
        next: (tasks) => {
          const task = tasks.find(t => t.taskId === id);
          if (task) {
            this.form.patchValue(task);
          } else {
            this.error = 'Task not found';
          }
          this.loading = false;
        },
        error: (e: any) => {
          this.error = e?.error?.message || 'Failed to load task';
          this.loading = false;
        }
      });
    }
  }

  private loadUsers() {
    this.usersService.list().subscribe(users => {
      this.users = users;
    });
  }

  private loadDeals() {
    this.dealsService.list().subscribe(deals => {
      this.deals = deals;
    });
  }

  form = this.fb.group({
    description: ['', Validators.required],
    status: ['Pending', Validators.required],
    dueDate: [''],
    dealName: [''],
    assignedTo: [''],
  });

  save() {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    const payload = this.form.value as any;
    const req = this.isEdit ? this.svc.update(taskId, payload) : this.svc.create(payload);
    req.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: e => { this.error = e?.error?.message || 'Save failed'; this.loading = false; }
    });
  }
}
