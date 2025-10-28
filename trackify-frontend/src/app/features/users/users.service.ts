import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../core/types';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api/auth';

  list() { return this.http.get<User[]>(`${this.base}/users`); }
  get(userId: number) { return this.http.get<User>(`${this.base}/users/${userId}`); }
  // Frontend user creation should call the register endpoint on the backend
  // which accepts UserDTO (including password) and returns the created user.
  create(dto: any) { return this.http.post<User>(`${this.base}/register`, dto); }
  update(userId: number, dto: Partial<User>) { return this.http.put<User>(`${this.base}/users/${userId}`, dto); }
  remove(userId: number) { return this.http.delete<void>(`${this.base}/users/${userId}`); }
  updateRoles(userId: number, roles: string[]) {
    // Backend expects a JSON array (Set<String>) in the request body: send roles directly
    return this.http.put<User>(`${this.base}/users/${userId}/roles`, roles);
  }
}


