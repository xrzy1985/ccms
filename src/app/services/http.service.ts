import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  LOCAL_URL: string = 'http://localhost:3000/customers';

  customers: customer[];

  constructor(private http: HttpClient) {
    this.customers = [];
  }

  gatherCustomers() {
    this.getCustomers().subscribe({
      next: (resp: customer[]) => {
        this.customers.length = 0;
        for (let i = 0, iLen = resp.length; i < iLen; i++) {
          const customer = resp[i];
          this.customers.push(customer);
        }
        this.setCustomers(this.customers);
      },
      error: (error: any) => {
        console.error('ERROR: GET REQUEST');
      },
    });
  }

  getCustomersNow() {
    return this.customers;
  }

  setCustomers(customers: customer[]) {
    this.customers = customers;
  }

  deleteCustomer(id: number) {
    return this.http.delete<any>(`${this.LOCAL_URL}/` + id);
  }

  postCustomer(customer: customer) {
    return this.http.post<any>(`${this.LOCAL_URL}`, customer);
  }

  putCustomer(id: number, customer: customer) {
    return this.http.put<any>(`${this.LOCAL_URL}/` + id, customer);
  }

  getCustomers() {
    return this.http.get<any>(`${this.LOCAL_URL}`);
  }
}