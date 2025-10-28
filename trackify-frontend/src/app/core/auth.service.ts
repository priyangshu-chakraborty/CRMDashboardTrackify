import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponse, User } from './types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'trackify_token';
  private userKey = 'trackify_user';
  private user$ = new BehaviorSubject<User | null>(this.loadUser());

  get currentUser$() { return this.user$.asObservable(); }
  get token() { return localStorage.getItem(this.tokenKey); }
  get currentUser() { return this.user$.value; }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  private persist(auth: AuthResponse) {
    localStorage.setItem(this.tokenKey, auth.token);
    localStorage.setItem(this.userKey, JSON.stringify(auth.user));
    this.user$.next(auth.user);
  }

  register(payload: { username: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload)
      .pipe(tap(res => this.persist(res)));
  }

  login(payload: { username: string; password: string }) {
    return this.http.post<{ token: string; user: User }>(`${this.baseUrl}/login`, payload)
      .pipe(
        tap(res => {
          if (!res.token || !res.user) {
            throw new Error('Invalid response from server');
          }
          // Backend returns exact structure we need: { token, user }
          this.persist(res);
        })
      );
  }

  me() {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(tap(user => {
      localStorage.setItem(this.userKey, JSON.stringify(user));
      this.user$.next(user);
    }));
  }

  hasRole(role: string | string[]) {
    const user = this.currentUser;
    if (!user) return false;
    const need = Array.isArray(role) ? role : [role];
    return need.some(r => user.roles.includes(r as any));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user$.next(null);
    this.router.navigate(['/login']);
  }
}
