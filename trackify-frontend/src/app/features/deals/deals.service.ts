import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type DealStage = 'Proposal' | 'Lead' | 'Closed Lost' | 'Closed Won';

export interface Deal {
  dealId?: number;
  dealName: string;
  amount: number;  // Will be received as BigDecimal from backend
  stage: DealStage;
  customerName?: string;  // from Customer entity
  assignedTo?: string;   // username from User entity
  createdAt?: string;    // ISO string from LocalDateTime
  updatedAt?: string;    // ISO string from LocalDateTime
}

@Injectable({ providedIn: 'root' })
export class DealsService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api/deals';

  list() { return this.http.get<Deal[]>(this.base); }
  byStage(stage: DealStage) { return this.http.get<Deal[]>(`${this.base}/stage/${stage}`); }
  get(dealId: number) { return this.http.get<Deal>(`${this.base}/${dealId}`); }
  create(dto: Deal) { return this.http.post<Deal>(this.base, dto); }
  update(dealId: number, dto: Deal) { return this.http.put<Deal>(`${this.base}/${dealId}`, dto); }
  remove(dealId: number) { return this.http.delete<void>(`${this.base}/${dealId}`); }
}
