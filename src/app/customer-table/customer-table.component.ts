import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { customer } from '../interfaces/customer';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpService } from '../services/http.service';
import '../../styles.scss';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  customers!: customer[];
  dataSource: MatTableDataSource<any>;
  filteredDataSource: MatTableDataSource<any>;
  filteredCustomers!: customer[];

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'access',
    'dateControl',
    'comment',
    'edit',
    'delete',
  ];

  constructor(public dialog: MatDialog, private http: HttpService) {
    this.customers = [];
    this.dataSource = new MatTableDataSource(this.customers);
    this.filteredCustomers = [];
    this.filteredDataSource = new MatTableDataSource(this.filteredCustomers);
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  ngDoCheck() {
    if (this.customers.length) {
      this.dataSource = new MatTableDataSource(this.customers);
    }
    if (this.filteredCustomers.length) {
      this.dataSource = new MatTableDataSource(this.filteredCustomers);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCustomers() {
    this.http.getCustomers().subscribe({
      next: (resp: customer[]) => {
        this.customers.length = 0;
        for (let i = 0, iLen = resp.length; i < iLen; i++) {
          const customer = resp[i];
          this.customers.push(customer);
        }
        this.http.setCustomers(this.customers);
      },
      error: (error: any) => {
        console.error('ERROR: GET REQUEST');
      },
    });
  }

  editCustomer(customer: customer): void {
    this.dialog
      .open(DialogComponent, {
        width: '50%',
        height: '90vh',
        data: customer,
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp === 'update') {
          this.getCustomers();
        }
      });
  }

  addCustomer(trigger: boolean) {
    this.dialog.open(DialogComponent, {
      width: '50%',
      height: '90vh',
    }).afterClosed()
    .subscribe((resp) => {
      if (resp !== 'update') {
        this.getCustomers();
      }
    });;
  }

  deleteCustomer(id: number) {
    this.http.deleteCustomer(id)
    .subscribe({
      next: (resp) => {
        this.getCustomers();
      },
      error: (error: any) => {
        console.error('ERROR: DELETE REQUEST');
      },
    })
  }

  applyDataSource(): MatTableDataSource<any> {
    return this.dataSource.filter !== '' ?
      new MatTableDataSource(this.filteredCustomers) :
      new MatTableDataSource(this.customers);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filteredCustomers = this.dataSource.filteredData;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
