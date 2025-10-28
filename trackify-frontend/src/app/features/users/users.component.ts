import { Component, inject } from '@angular/core';
import { UsersService } from './users.service';
import { User } from '../../core/types';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [NgFor, NgIf, FormsModule],
  template: `
  <div class="card">
    <div class="actions" style="justify-content:space-between;align-items:center">
      <h2>Users</h2>
      <button class="btn" (click)="showNewUserForm = true" *ngIf="!showNewUserForm">New User</button>
    </div>

    <div class="form" *ngIf="showNewUserForm">
      <h3>Create New User</h3>
      <form (ngSubmit)="createUser()" #newUserForm="ngForm">
        <label class="label">Username *</label>
        <input class="input" name="username" [(ngModel)]="newUser.username" required>
        
        <label class="label">Email *</label>
        <input class="input" type="email" name="email" [(ngModel)]="newUser.email" required>
        
        <label class="label">Password *</label>
        <input class="input" type="password" name="password" [(ngModel)]="newUser.password" required>
        
        <label class="label">Roles *</label>
        <select class="select" name="roles" [(ngModel)]="newUser.roles" multiple required>
          <option value="ROLE_SALES">Sales</option>
          <option value="ROLE_MANAGER">Manager</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>

        <div class="actions">
          <button type="submit" class="btn" [disabled]="newUserForm.invalid || creating">Create</button>
          <button type="button" class="btn outline" (click)="cancelNewUser()">Cancel</button>
        </div>
        <p *ngIf="error" style="color:#ef4444">{{ error }}</p>
      </form>
    </div>

    <table class="table" *ngIf="users.length; else empty">
      <thead><tr><th>Username</th><th>Email</th><th>Roles</th><th>Actions</th></tr></thead>
      <tbody>
        <tr *ngFor="let u of users">
          <td>{{ u.username }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.roles.join(', ') }}</td>
          <td class="actions">
            <select class="select" [(ngModel)]="roleSelections[u.userId]" [name]="'roles_' + u.userId" multiple 
                   (change)="onRoleSelectionChange(u.userId)">
              <option value="ROLE_SALES">Sales</option>
              <option value="ROLE_MANAGER">Manager</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
            <button class="btn secondary" (click)="saveRoles(u.userId)" [disabled]="!hasRoleChanges(u.userId)">
              Save Roles
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <ng-template #empty><p>No users found.</p></ng-template>
  </div>
  `,
})
export class UsersComponent {
  svc = inject(UsersService);
  users: User[] = [];
  roleSelections: Record<number, string[]> = {};
  // Make console available to template
  console = console;
  showNewUserForm = false;
  creating = false;
  error = '';
  newUser = {
    username: '',
    email: '',
    password: '',
    roles: [] as string[]
  };

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.svc.list().subscribe({
      next: (us) => {
        console.log('Received users:', us);
        this.users = us;
        us.forEach(u => {
          console.log('Processing user:', u);
          // Initialize with current roles even if empty array
          this.roleSelections[u.userId] = u.roles ? [...u.roles] : [];
        });
        console.log('Role selections initialized:', this.roleSelections);
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        if (err.status === 403) {
          alert('You do not have permission to view users');
        }
      }
    });
  }

  onRoleSelectionChange(id: number) {
    console.log(`Roles changed for user ${id}:`, this.roleSelections[id]);
  }

  hasRoleChanges(userId: number): boolean {
    const user = this.users.find(u => u.userId === userId);
    if (!user || !this.roleSelections[userId]) return false;
    
    const currentRoles = user.roles.sort();
    const selectedRoles = [...this.roleSelections[userId]].sort();
    return JSON.stringify(currentRoles) !== JSON.stringify(selectedRoles);
  }

  createUser() {
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password || !this.newUser.roles.length) {
      this.error = 'Please fill in all required fields';
      return;
    }
    
    this.creating = true;
    this.error = '';
    
    const payload: any = {
      username: this.newUser.username,
      email: this.newUser.email,
      password: this.newUser.password,
      roles: this.newUser.roles
    };

    this.svc.create(payload).subscribe({
      next: () => {
        this.showNewUserForm = false;
        this.creating = false;
        this.resetNewUser();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to create user:', err);
        this.error = err?.error?.message || 'Failed to create user';
        this.creating = false;
      }
    });
  }

  cancelNewUser() {
    this.showNewUserForm = false;
    this.resetNewUser();
    this.error = '';
  }

  resetNewUser() {
    this.newUser = {
      username: '',
      email: '',
      password: '',
      roles: []
    };
  }

  saveRoles(id: number) {
    console.log('Form submitted - Saving roles for user ID:', id);
    
    // Prevent submission if no ID
    if (!id) {
      console.error('No user ID provided');
      return;
    }

    // Get selected roles, ensuring we have an array
    const selectedRoles = this.roleSelections[id] || [];
    console.log('Sending roles update:', {
      userId: id,
      roles: selectedRoles
    });

    // Send the update request
    this.svc.updateRoles(id, selectedRoles).subscribe({
      next: (updatedUser) => {
        console.log('Roles updated successfully:', updatedUser);
        // Update the local state immediately
        const userIndex = this.users.findIndex(u => u.userId === id);
        if (userIndex !== -1) {
          this.users[userIndex] = updatedUser;
        }
        // Show success message
        alert('Roles updated successfully');
      },
      error: (err) => {
        console.error('Failed to update roles:', err);
        if (err.status === 403) {
          alert('You do not have permission to update roles');
        } else {
          alert('Failed to update roles. Please try again.');
        }
      }
    });
  }
}
