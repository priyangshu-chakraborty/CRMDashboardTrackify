import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NotificationsService, NotificationCreate } from '../notifications/notifications.service';

export type TaskStatus = 'Pending' | 'Completed';
export interface Task {
  taskId?: number;
  description: string;
  status: TaskStatus;
  dueDate?: string;  
  createdAt?: string; 
  dealName?: string;
  assignedTo?: string; // username of assigned user
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private http = inject(HttpClient);
  private notifications = inject(NotificationsService);
  private base = 'http://localhost:8080/api/tasks';

  list() { return this.http.get<Task[]>(this.base); }
  byStatus(status: TaskStatus) { return this.http.get<Task[]>(`${this.base}/status/${status}`); }

  create(dto: Task): Observable<Task> {
    return this.http.post<Task>(this.base, dto).pipe(
      switchMap((task: Task) => {
        // Build notification payload
        const notif: NotificationCreate = {
          username: task.assignedTo!,   // assumes assignedTo is required
          taskId: task.taskId!
        };
        // First return the notification creation, but map back to the task
        return this.notifications.create(notif).pipe(
          // ignore notification response, return the created task
          switchMap(() => [task])
        );
      })
    );
  }

  update(id: number, dto: Task) { return this.http.put<Task>(`${this.base}/${id}`, dto); }
  remove(taskId: number) { return this.http.delete<void>(`${this.base}/${taskId}`); }
}
