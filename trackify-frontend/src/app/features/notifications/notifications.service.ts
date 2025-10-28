import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface NotificationCreate {
  username: string;
  taskId: number;
}

export interface EmailNotification {
  notificationId?: number;
  sentTime: string;  // LocalDateTime will be received as ISO string
  status: string;
  username: string;
  taskDescription: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private base = 'http://18.118.186.205:8080/api/notifications';

  list() { return this.http.get<EmailNotification[]>(this.base); }
  byStatus(status: string) { return this.http.get<EmailNotification[]>(`${this.base}/status/${status}`); }
  create(dto: NotificationCreate) { return this.http.post<EmailNotification>(this.base, dto); }
  update(id: number, dto: EmailNotification) { return this.http.put<EmailNotification>(`${this.base}/${id}`, dto); }
  remove(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}
