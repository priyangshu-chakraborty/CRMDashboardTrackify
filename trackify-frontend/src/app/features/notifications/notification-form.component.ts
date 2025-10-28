import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService, NotificationCreate } from './notifications.service';
import { NgFor, NgIf } from '@angular/common';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

@Component({
  standalone: true,
  selector: 'app-notification-form',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  template: `
  <div class="card">
    <h2>{{ isEdit ? 'Edit notification' : 'New notification' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()" class="form">
      <label class="label">Task</label>
      <select class="select" formControlName="taskId">
        <option value="">Select a task</option>
        <option *ngFor="let task of tasks" [value]="task.taskId">{{ task.description }}</option>
      </select>
      
      <label class="label">User</label>
      <select class="select" formControlName="username">
        <option value="">Select a user</option>
        <option *ngFor="let user of users" [value]="user.username">{{ user.username }}</option>
      </select>

      <div class="actions">
        <button class="btn" type="submit" [disabled]="form.invalid || loading">Save</button>
        <button class="btn outline" type="button" (click)="router.navigate(['/notifications'])">Cancel</button>
      </div>
      <p *ngIf="error" style="color:#ef4444">{{ error }}</p>
    </form>
  </div>
  `
})
export class NotificationFormComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  svc = inject(NotificationsService);
  tasksService = inject(TasksService);
  usersService = inject(UsersService);
  
  isEdit = !!this.route.snapshot.paramMap.get('id');
  loading = false;
  error = '';
  tasks: any[] = [];
  users: any[] = [];
  form = this.fb.group({
    taskId: ['', Validators.required],
    username: ['', Validators.required]
  });

  constructor() {
    // Load tasks and users for dropdowns
    this.tasksService.list().subscribe({
      next: tasks => {
        console.log('Loaded tasks:', tasks);
        this.tasks = tasks;
      },
      error: err => {
        console.error('Error loading tasks:', err);
        this.error = 'Failed to load tasks';
      }
    });

    this.usersService.list().subscribe({
      next: users => {
        console.log('Loaded users:', users);
        this.users = users;
      },
      error: err => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users';
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.error = 'Please select both a task and a user';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const formValue = this.form.value;
    const payload: NotificationCreate = {
      username: formValue.username || '',
      taskId: Number(formValue.taskId)
    };
    
    this.svc.create(payload).subscribe({
      next: () => this.router.navigate(['/notifications']),
      error: e => {
        console.error('Failed to create notification:', e);
        this.error = e?.error?.message || 'Failed to create notification';
        this.loading = false;
      }
    });
  }
}
