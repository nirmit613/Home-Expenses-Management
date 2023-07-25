import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Month, Table, TableRow } from '../models/models';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TableDataService } from '../services/table-data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  addRowForm!: FormGroup;
  @Input() table!: Table;
  @Input() monthNumber!: string;
  @Input() monthYear!: string;
  @Output() sumUpdated = new EventEmitter<number>();
  constructor(public dataSource: TableDataService) {
    this.table = {
      tableName: '',
      columns: [],
      rows: [],
      isSaved: false,
    };
    this.addRowForm = new FormGroup({});
  }
  ngOnInit() {
    this.dataSource
      .getTableRows(this.monthYear, this.monthNumber, this.table.tableName)
      .subscribe((res) => {
        this.table.rows = [];
        for (let row of res) {
          this.addRowToArray(row.id, row.date, row.name, row.amount, true);
        }
      });
    this.addRowForm = new FormGroup({
      date: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
        this.daysInMonthValidator(this.monthYear, this.monthNumber),
      ]),
      name: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
    });
  }

  public addNewRow() {
    let date = this.dateControl.value;
    let name = this.nameControl.value;
    let amount = this.amountControl.value;

    let monthDataForBackend = {
      monthYear: this.monthYear,
      monthNumber: this.monthNumber,
      tableName: this.table.tableName,
      date: date,
      name: name,
      amount: amount,
    };
    this.dataSource.postTableRow(monthDataForBackend).subscribe((res) => {
      this.addRowToArray(parseInt(res), date, name, amount, true);
    });
  }
  public addRowToArray(
    id: number,
    date: string,
    name: string,
    amount: string,
    isSaved: boolean
  ) {
    let row: TableRow = {
      id: id,
      date: date,
      name: name,
      amount: amount,
      isSaved: isSaved,
    };
    this.table.rows.push(row);
    this.updateTheSum();
    this.clearForm();
  }
  public clearForm() {
    this.dateControl.setValue('');
    this.nameControl.setValue('');
    this.amountControl.setValue('');
  }
  public updateTheSum() {
    let sum = 0;
    this.table.rows.forEach((row, index) => {
      sum += parseInt(row.amount);
    });
    this.sumUpdated.emit(sum);
  }
  public editRow(rowId: number | undefined) {
    if (
      this.dateControl.value == '' &&
      this.nameControl.value == '' &&
      this.amountControl.value == ''
    ) {
      this.table.rows.forEach((row, index) => {
        if (rowId && row.id == rowId) {
          this.dateControl.setValue(row.date);
          this.nameControl.setValue(row.name);
          this.amountControl.setValue(row.amount);
          this.deleteRow(row.id);
        }
      });
    } else {
      alert('First edit pending row data');
    }
  }

  public deleteRow(id: number | undefined) {
    this.table.rows.forEach((row, index) => {
      if (row.id && row.id == id) {
        this.dataSource.deleteTableRow(row.id).subscribe((res) => {
          this.table.rows.splice(index, 1);
        });
      }
    });
  }

  public get dateControl(): FormControl {
    return this.addRowForm.controls['date'] as FormControl;
  }
  public get nameControl(): FormControl {
    return this.addRowForm.controls['name'] as FormControl;
  }
  public get amountControl(): FormControl {
    return this.addRowForm.controls['amount'] as FormControl;
  }
  public get RowForm() {
    return this.addRowForm as FormGroup;
  }

  public daysInMonthValidator(
    monthYear: string,
    monthNumber: string
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (
        parseInt(control.value) < 1 ||
        parseInt(control.value) > this.getDaysInMonth(monthYear, monthNumber)
      ) {
        return { daysInvalid: true };
      }
      return null;
    };
  }
  public getDaysInMonth(monthYear: string, monthNumber: string): number {
    return new Date(parseInt(monthYear), parseInt(monthNumber), 0).getDate();
  }
}
