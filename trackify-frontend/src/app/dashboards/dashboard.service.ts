// dashboard.service.ts
import { Injectable, inject } from '@angular/core';
import { DealsService, Deal, DealStage } from '../features/deals/deals.service';
import { TasksService, Task } from '../features/tasks/tasks.service';
import { map, Observable, of } from 'rxjs';
import { CustomersService } from '../features/customers/customers.service';

export interface DealMetrics {
  totalDeals: number;
  totalValue: number;
  byStageCounts: Record<DealStage, number>;
  byStageValues: Record<DealStage, number>;
  monthlyTrends: Array<{
    month: string;
    value: number;
    count: number;
  }>;
  winRate: number;
  averageDealSize: number;
  conversion: {
    leadToProposal: number;
    proposalToWon: number;
  };
}

export interface TaskMetrics {
  total: number;
  pending: number;
  completed: number;
  upcomingDue: number;
  overdue: number;
  byDealDistribution: Record<string, number>;
  byAssigneeDistribution: Record<string, number>;
  completionRate: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private dealsService = inject(DealsService);
  private tasksService = inject(TasksService);
private customersService = inject(CustomersService);


  getDealMetrics(): Observable<DealMetrics> {
    return this.dealsService.list().pipe(
      map(deals => {
        // Filter out deals without amounts to avoid NaN issues
        const validDeals = deals.filter(d => typeof d.amount === 'number' && !isNaN(d.amount));
        
        const metrics: DealMetrics = {
          totalDeals: validDeals.length,
          totalValue: validDeals.reduce((sum: number, d: Deal) => sum + d.amount, 0),
          byStageCounts: { 'Proposal': 0, 'Lead': 0, 'Closed Lost': 0, 'Closed Won': 0 },
          byStageValues: { 'Proposal': 0, 'Lead': 0, 'Closed Lost': 0, 'Closed Won': 0 },
          monthlyTrends: [],
          winRate: 0,
          averageDealSize: 0,
          conversion: { leadToProposal: 0, proposalToWon: 0 }
        };

        const today = new Date();
        const monthlyData: Record<string, { value: number; count: number; order: number }> = {};
        
        // Initialize last 6 months with month names
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          monthlyData[key] = {
            value: 0,
            count: 0,
            order: 5 - i
          };
        }

        let totalLeads = 0, totalProposals = 0, wonDeals = 0, totalClosedDeals = 0;

        validDeals.forEach((deal: Deal) => {
          if (metrics.byStageCounts.hasOwnProperty(deal.stage)) {
            metrics.byStageCounts[deal.stage]++;
            metrics.byStageValues[deal.stage] += deal.amount;
          }

          // Always count the deal if it has a creation date
          if (deal.createdAt) {
            const date = new Date(deal.createdAt);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (monthlyData[key]) {
              monthlyData[key].value += deal.amount;
              monthlyData[key].count++;
            }
          }

          if (deal.stage === 'Lead') totalLeads++;
          if (deal.stage === 'Proposal') totalProposals++;
          if (deal.stage === 'Closed Won') wonDeals++;
          if (deal.stage === 'Closed Won' || deal.stage === 'Closed Lost') totalClosedDeals++;
        });

        metrics.monthlyTrends = Object.entries(monthlyData)
          .sort((a, b) => a[1].order - b[1].order)
          .map(([key, data]) => {
            const [year, month] = key.split('-').map(Number);
            const date = new Date(year, month);
            const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            console.log('Monthly trend entry:', { key, data, label });
            return { month: label, value: data.value, count: data.count };
          });
        console.log('Final monthly trends:', metrics.monthlyTrends);

        metrics.winRate = totalClosedDeals > 0 ? (wonDeals / totalClosedDeals) * 100 : 0;
        metrics.averageDealSize = metrics.totalDeals > 0 ? metrics.totalValue / metrics.totalDeals : 0;
        metrics.conversion = {
          leadToProposal: totalLeads > 0 ? (totalProposals / totalLeads) * 100 : 0,
          proposalToWon: totalProposals > 0 ? (wonDeals / totalProposals) * 100 : 0
        };

        return metrics;
      })
    );
  }

  getTaskMetrics(): Observable<TaskMetrics> {
    return this.tasksService.list().pipe(
      map(tasks => {
        const today = new Date();
        const metrics: TaskMetrics = {
          total: tasks.length,
          pending: 0,
          completed: 0,
          upcomingDue: 0,
          overdue: 0,
          byDealDistribution: {},
          byAssigneeDistribution: {},
          completionRate: 0
        };

        tasks.forEach(task => {
          if (task.status === 'Completed') {
            metrics.completed++;
          } else {
            metrics.pending++;
            if (task.dueDate) {
              const dueDate = new Date(task.dueDate);
              if (dueDate < today) metrics.overdue++;
              else if (this.isWithinNextWeek(dueDate, today)) metrics.upcomingDue++;
            }
          }

          if (task.dealName) {
            metrics.byDealDistribution[task.dealName] = (metrics.byDealDistribution[task.dealName] || 0) + 1;
          }
          if (task.assignedTo) {
            metrics.byAssigneeDistribution[task.assignedTo] = (metrics.byAssigneeDistribution[task.assignedTo] || 0) + 1;
          }
        });

        metrics.completionRate = metrics.total > 0 ? (metrics.completed / metrics.total) * 100 : 0;
        return metrics;
      })
    );
  }

  private isWithinNextWeek(date: Date, today: Date): boolean {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return date <= nextWeek;
  }


  getCustomerCount(): Observable<number> {
    return this.customersService.list().pipe(
      map(customers => customers.length)
    );
  }
}
