import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-manager-dashboard',
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <div class="welcome-card">
        <h1>Welcome back, Manager 👋</h1>
        <p>Here’s your control center. Quickly access customers, deals, tasks, and notifications.</p>
      </div>

      <div class="actions">
        <a routerLink="/customers" class="tile">
          <span class="icon">👥</span>
          <span class="label">Customers</span>
        </a>
        <a routerLink="/deals" class="tile">
          <span class="icon">💼</span>
          <span class="label">Deals</span>
        </a>
        <a routerLink="/tasks" class="tile">
          <span class="icon">✅</span>
          <span class="label">Tasks</span>
        </a>
        <a routerLink="/notifications" class="tile">
          <span class="icon">🔔</span>
          <span class="label">Notifications</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      font-family: 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .welcome-card {
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }

    .welcome-card h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 600;
    }

    .welcome-card p {
      margin: 0;
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.5rem;
    }

    .tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      text-decoration: none;
      color: #333;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .tile:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }

    .icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .label {
      font-size: 1.1rem;
    }
  `]
})
export class ManagerDashboardComponent {}
