import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe, NgIf, NgFor } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { DealMetrics, TaskMetrics } from './dashboard.types';
import Chart from 'chart.js/auto';
import { CategoryScale, LineElement, PointElement, LinearScale } from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-sales-dashboard',
  imports: [RouterLink, AsyncPipe, DecimalPipe, NgIf, NgFor, BaseChartDirective],
  template: `
    <div class="dashboard-grid">
      <!-- Quick Actions -->
      <div class="card quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/deals/new" class="action-btn primary">
            <span class="value">{{ (dealMetrics$ | async)?.totalDeals || 0 }}</span>
            <span class="label">Total Deals</span>
            <span class="action">+ New Deal</span>
          </a>
          <a routerLink="/tasks/new" class="action-btn success">
            <span class="value">{{ (taskMetrics$ | async)?.pending || 0 }}</span>
            <span class="label">Open Tasks</span>
            <span class="action">+ New Task</span>
          </a>
          <a routerLink="/customers" class="action-btn info">
            <span class="value">{{ (customerCount$ | async) || 0 }}</span>
            <span class="label">Active Customers</span>
            <span class="action">View All</span>
          </a>
        </div>
      </div>

      <!-- Deal Pipeline -->
      <div class="card pipeline" *ngIf="dealMetrics$ | async as metrics">
        <div class="card-header">
          <h2>Deal Pipeline</h2>
          <div class="metrics">
            <div class="metric">
              <span class="label">Total Value</span>
              <span class="value">₹{{ metrics.totalValue | number:'1.0-0' }}</span>
            </div>
            <div class="metric">
              <span class="label">Win Rate</span>
              <span class="value">{{ metrics.winRate | number:'1.0-1' }}%</span>
            </div>
          </div>
        </div>
        <div class="pipeline-stats">
          <div class="pipeline-stage" *ngFor="let stage of getStageStats(metrics)">
            <div class="stage-header">
              <span class="stage-name">{{ stage.name }}</span>
              <span class="stage-count">{{ stage.count }}</span>
            </div>
            <div class="stage-bar" [style.width.%]="stage.percentage">
              <div class="bar" [style.background-color]="stage.color"></div>
            </div>
            <span class="stage-value">₹{{ stage.value | number }}</span>
          </div>
        </div>
        <div class="chart-container">
          <canvas baseChart [type]="'doughnut'" [data]="getPipelineChartData(metrics)" [options]="pipelineChartOptions">
          </canvas>
        </div>
      </div>

      <!-- Tasks Overview -->
      <div class="card tasks" *ngIf="taskMetrics$ | async as tasks">
        <div class="card-header">
          <h2>Tasks Overview</h2>
          <div class="completion-rate">
            <div class="progress-ring">
              <svg viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="#e2e8f0" stroke-width="3" fill="none"/>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  [attr.stroke-dasharray]="tasks.completed + ', 100'"
                  stroke="#10b981" stroke-width="3" fill="none"/>
              </svg>
              <span class="percentage">{{ tasks.completionRate | number:'1.0-0' }}%</span>
            </div>
          </div>
        </div>
        <div class="tasks-grid">
          <div class="task-stat pending">
            <span class="stat-value">{{ tasks.pending }}</span>
            <span class="stat-label">Pending</span>
          </div>
          <div class="task-stat upcoming">
            <span class="stat-value">{{ tasks.upcomingDue }}</span>
            <span class="stat-label">Due Soon</span>
          </div>
          <div class="task-stat completed">
            <span class="stat-value">{{ tasks.completed }}</span>
            <span class="stat-label">Completed</span>
          </div>
          <div class="task-stat overdue">
            <span class="stat-value">{{ tasks.overdue }}</span>
            <span class="stat-label">Overdue</span>
          </div>
        </div>
        <div class="chart-container">
          <canvas baseChart [type]="'doughnut'" [data]="getTaskChartData(tasks)" [options]="taskChartOptions">
          </canvas>
        </div>
      </div>

      <!-- Monthly Trend -->
      <div class="card trend" *ngIf="dealMetrics$ | async as metrics">
        <div class="card-header">
          <h2>Monthly Sales Trend</h2>
          <div class="trend-summary">
            <div class="metric">
              <span class="label">Avg Deal Size</span>
              <span class="value">₹{{ metrics.averageDealSize | number:'1.0-0' }}</span>
            </div>
          </div>
        </div>
        <div class="chart-container trend-chart">
          <canvas baseChart [type]="'line'" [data]="getTrendChartData(metrics)" [options]="trendChartOptions">
          </canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-grid {
      display: grid;
      gap: 1.5rem;
      padding: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    }

    .card {
      background: #ffffff;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .card-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      padding: 1.25rem;
      border-radius: 0.75rem;
      text-decoration: none;
      transition: transform 0.2s;
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    .action-btn .value {
      font-size: 2rem;
      font-weight: 600;
      color: white;
    }

    .action-btn .label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0.25rem 0;
    }

    .action-btn .action {
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
      margin-top: 0.5rem;
    }

    .action-btn.primary { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .action-btn.success { background: linear-gradient(135deg, #10b981, #059669); }
    .action-btn.info { background: linear-gradient(135deg, #6366f1, #4f46e5); }

    .pipeline-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .pipeline-stage {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stage-name {
      font-size: 0.875rem;
      color: #64748b;
    }

    .stage-count {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0f172a;
    }

    .stage-bar {
      height: 8px;
      background: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;
    }

    .stage-bar .bar {
      height: 100%;
      transition: width 0.3s ease;
    }

    .stage-value {
      font-size: 0.875rem;
      color: #0f172a;
      text-align: right;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .task-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      border-radius: 0.75rem;
      text-align: center;
    }

    .task-stat.pending { background: #dbeafe; }
    .task-stat.upcoming { background: #fef9c3; }
    .task-stat.completed { background: #dcfce7; }
    .task-stat.overdue { background: #fee2e2; }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #0f172a;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .chart-container {
      height: 300px;
      margin-top: 1.5rem;
    }

    .trend-chart {
      height: 350px;
    }

    .metrics {
      display: flex;
      gap: 2rem;
    }

    .metric {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .metric .label {
      font-size: 0.875rem;
      color: #64748b;
    }

    .metric .value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #0f172a;
    }

    .progress-ring {
      position: relative;
      width: 50px;
      height: 50px;
    }

    .progress-ring svg {
      transform: rotate(-90deg);
    }

    .progress-ring path {
      transition: stroke-dasharray 0.3s ease;
    }

    .progress-ring .percentage {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.875rem;
      font-weight: 600;
      color: #10b981;
    }
  `]
})
export class SalesDashboardComponent implements OnInit {
  ngOnInit() {
    Chart.register(CategoryScale, LineElement, PointElement, LinearScale);
  }
  private dashboard = inject(DashboardService);

  dealMetrics$ = this.dashboard.getDealMetrics() as Observable<DealMetrics>;
  taskMetrics$ = this.dashboard.getTaskMetrics() as Observable<TaskMetrics>;
  customerCount$: Observable<number> = this.dashboard.getCustomerCount();

  stageColors = {
    'Lead': '#60a5fa',
    'Proposal': '#34d399',
    'Closed Won': '#10b981',
    'Closed Lost': '#f87171'
  };

  pipelineChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, font: { size: 12 } }
      }
    }
  };

  taskChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, font: { size: 12 } }
      }
    }
  };

  trendChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { padding: 20, font: { size: 12 } }
      }
    },
    scales: {
      y: {
        position: 'left',
        title: { display: true, text: 'Amount (₹)', font: { size: 12 } },
        beginAtZero: true
      },
      y1: {
        position: 'right',
        title: { display: true, text: 'Number of Deals', font: { size: 12 } },
        beginAtZero: true,
        grid: { drawOnChartArea: false }
      },
      x: {
        grid: { display: false }
      }
    },
    elements: {
      line: {
        tension: 0.4 // Makes lines curved
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  getStageStats(metrics: DealMetrics) {
    const total = metrics.totalDeals;
    return Object.entries(metrics.byStageCounts).map(([name, count]) => ({
      name,
      count,
      value: metrics.byStageValues[name],
      percentage: (count as number / total) * 100,
      color: this.stageColors[name as keyof typeof this.stageColors]
    }));
  }

  getPipelineChartData(metrics: DealMetrics): ChartData<'doughnut'> {
    const stages = Object.keys(metrics.byStageCounts);
    return {
      labels: stages,
      datasets: [{
        data: stages.map(stage => metrics.byStageValues[stage]),
        backgroundColor: stages.map(stage => this.stageColors[stage as keyof typeof this.stageColors]),
        borderWidth: 0,
        hoverOffset: 4
      }]
    };
  }

  getTaskChartData(metrics: TaskMetrics): ChartData<'doughnut'> {
    return {
      labels: ['Pending', 'Due Soon', 'Completed', 'Overdue'],
      datasets: [{
        data: [
          metrics.pending,
          metrics.upcomingDue,
          metrics.completed,
          metrics.overdue
        ],
        backgroundColor: [
          '#60a5fa',  // Blue for Pending
          '#fbbf24',  // Yellow for Due Soon
          '#10b981',  // Green for Completed
          '#f87171'   // Red for Overdue
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    };
  }

  getTrendChartData(metrics: DealMetrics): ChartData<'line'> {
    console.log('Generating trend chart data from metrics:', metrics);
    const chartData = {
      labels: metrics.monthlyTrends.map((t: any) => t.month),
      datasets: [
        {
          label: 'Sales Value',
          data: metrics.monthlyTrends.map((t: any) => t.value),
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f620',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Deal Count',
          data: metrics.monthlyTrends.map((t: any) => t.count),
          borderColor: '#10b981',
          backgroundColor: '#10b98120',
          fill: true,
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    };
    console.log('Generated chart data:', chartData);
    return chartData;
  }
}
