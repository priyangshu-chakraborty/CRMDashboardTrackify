export interface DealMetrics {
  totalDeals: number;
  totalValue: number;
  winRate: number;
  averageDealSize: number;
  byStageCounts: Record<string, number>;
  byStageValues: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    value: number;
    count: number;
  }>;
}

export interface TaskMetrics {
  pending: number;
  upcomingDue: number;
  completed: number;
  overdue: number;
  completionRate: number;
}