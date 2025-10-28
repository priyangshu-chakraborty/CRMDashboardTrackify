import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { SalesDashboardComponent } from './dashboards/sales-dashboard.component';
import { ManagerDashboardComponent } from './dashboards/manager-dashboard.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { CustomersListComponent } from './features/customers/customers-list.component';
import { CustomerDetailComponent } from './features/customers/customer-detail.component';
import { CustomerFormComponent } from './features/customers/customer-form.component';
import { DealsListComponent } from './features/deals/deals-list.component';
import { DealFormComponent } from './features/deals/deal-form.component';
import { TasksListComponent } from './features/tasks/tasks-list.component';
import { TaskFormComponent } from './features/tasks/task-form.component';
import { NotificationsListComponent } from './features/notifications/notifications-list.component';
import { NotificationFormComponent } from './features/notifications/notification-form.component';
import { UsersComponent } from './features/users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard/sales', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard/sales', component: SalesDashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/manager', component: ManagerDashboardComponent, canActivate: [roleGuard(['ROLE_MANAGER','ROLE_ADMIN'])] },
  { path: 'dashboard/admin', component: AdminDashboardComponent, canActivate: [roleGuard(['ROLE_ADMIN'])] },

  { path: 'customers', component: CustomersListComponent, canActivate: [authGuard] },
  { path: 'customers/new', component: CustomerFormComponent, canActivate: [roleGuard(['ROLE_MANAGER','ROLE_ADMIN'])] },
  { path: 'customers/:id', component: CustomerDetailComponent, canActivate: [authGuard] },
  { path: 'customers/:id/edit', component: CustomerFormComponent, canActivate: [roleGuard(['ROLE_MANAGER','ROLE_ADMIN'])] },

  { path: 'deals', component: DealsListComponent, canActivate: [authGuard] },
  { path: 'deals/new', component: DealFormComponent, canActivate: [roleGuard(['ROLE_MANAGER','ROLE_ADMIN'])] },
  { path: 'deals/:id/edit', component: DealFormComponent, canActivate: [roleGuard(['ROLE_MANAGER','ROLE_ADMIN'])] },

  { path: 'tasks', component: TasksListComponent, canActivate: [authGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [roleGuard(['ROLE_MANAGER','ROLE_ADMIN'])] },
  { path: 'tasks/:id/edit', component: TaskFormComponent, canActivate: [roleGuard(['ROLE_SALES','ROLE_MANAGER','ROLE_ADMIN'])] },

  { path: 'notifications', component: NotificationsListComponent, canActivate: [roleGuard(['ROLE_MANAGER','ROLE_ADMIN'])] },
  { path: 'notifications/new', component: NotificationFormComponent, canActivate: [roleGuard(['ROLE_MANAGER','ROLE_ADMIN'])] },
  { path: 'notifications/:id/edit', component: NotificationFormComponent, canActivate: [roleGuard(['ROLE_MANAGER','ROLE_ADMIN'])] },

  { path: 'users', component: UsersComponent, canActivate: [roleGuard(['ROLE_ADMIN'])] },

  { path: '**', redirectTo: 'dashboard/sales' }
];
