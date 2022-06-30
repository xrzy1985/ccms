import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCalendar } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import { access } from '../interfaces/access';
import { customer, defaultCustomer } from '../interfaces/customer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  buttonUsage: string = 'Save';
  roles: access[];
  customerForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editCustomer: customer
  ) {
    this.roles = [{ right: 'Customer' }, { right: 'Guest' }];
  }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      access: new FormControl('', [Validators.required]),
      dateControl: new FormControl('', []),
      comment: new FormControl('', []),
    });

    if (this.editCustomer) {
      this.buttonUsage = 'Update';
      this.customerForm.controls['access'].setValue(this.editCustomer.access);
      for (const key in this.editCustomer) {
        if (Object.prototype.hasOwnProperty.call(this.editCustomer, key)) {
          if (key.toLowerCase() !== 'id' && key.toLowerCase() !== 'access') {// @ts-ignore
            this.customerForm.controls[key].setValue(this.editCustomer[key]);
          }
        }
      }
    }

  }

  addOrUpdateCustomer(): void {
    if (!this.editCustomer) {
      if (this.customerForm.valid) {
        if (this.customerForm.value.dateControl === '') {
          this.customerForm.value.dateControl = new Date();
        }
        this.http.postCustomer(this.customerForm.value).subscribe({
          next: (resp: any) => {
            this.customerForm.reset();
            this.dialogRef.close();
          },
          error: (error: any) => {
            alert('There was an error adding the customer, try again.');
          },
        });
      }
    } else {
      if (this.editCustomer) {
        if (!this.editCustomer.date) {
          this.editCustomer.date = new Date();
        }
        this.http.putCustomer(this.editCustomer.id, this.customerForm.value).subscribe({
          next: (resp: any) => {
            this.customerForm.reset();
            this.dialogRef.close('update');
          },
          error: (error: any) => {
            alert('There was an error adding the customer, try again.');
          },
        });
      }
    }
  }

  closeDialog(): void {
    this.customerForm.reset();
    this.dialogRef.close();
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || (form && form.submitted))
    );
  }
}
