import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Customer {
  customerId?: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes?: string;
  address: string;
  createdBy?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private http = inject(HttpClient);
  private base = 'http://18.118.186.205:8080/api/customers';

  list() { return this.http.get<Customer[]>(this.base); }
  get(customerId: number) { return this.http.get<Customer>(`${this.base}/${customerId}`); }
  create(dto: Customer) { return this.http.post<Customer>(this.base, dto); }
  update(customerId: number, dto: Customer) { return this.http.put<Customer>(`${this.base}/${customerId}`, dto); }
  remove(customerId: number) { return this.http.delete<void>(`${this.base}/${customerId}`); }
}
