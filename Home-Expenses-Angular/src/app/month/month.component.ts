import { Component, Input, OnInit } from '@angular/core';
import { Month } from '../models/models';
import { TableDataService } from '../services/table-data.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
})
export class MonthComponent implements OnInit {
  @Input() month!: Month;
  constructor(public dataSource: TableDataService) {
    this.month = {
      monthYear: '',
      monthNumber: '',
      tables: [],
      calculations: [],
      isSaved: false,
    };
  }
  ngOnInit(): void {
    this.dataSource.previousSavingsObs.subscribe((res) => {
      if (
        this.month.monthNumber == res.monthNumber &&
        this.month.monthYear == res.monthYear
      ) {
        this.setCalculation('previous-savings', res.sum);
      }
    });

    this.dataSource.currentSavingsRequestObs.subscribe((res) => {
      if (
        this.month.monthYear == res.monthYear &&
        this.month.monthNumber == res.MonthNumber
      ) {
        this.currentSavingsUpdated();
      }
    });
    let pd = this.getPreviousDate(this.month.monthYear, this.month.monthNumber);
    this.dataSource.currentSavingsRequestObs.next({
      monthYear: pd.monthYear,
      MonthNumber: pd.monthNumber,
    });
  }
  public sumUpdated(tableName: string, sum: number) {
    if (tableName === 'earnings') {
      this.setCalculation('current-earnings', sum.toString());
    } else {
      this.setCalculation('current-expenditure', sum.toString());
    }
  }

  public setCalculation(name: string, sum: string) {
    this.month.calculations.forEach((val, index) => {
      if (val.name == name) {
        val.value = sum;
      }
    });
    this.setCurrentSavings();
  }
  public getCalculation(name: string) {
    let sum = '0';
    this.month.calculations.forEach((val, index) => {
      if (val.name == name) {
        sum = val.value;
      }
    });
    return parseInt(sum);
  }
  public setCurrentSavings() {
    let ps = this.getCalculation('previous-savings');
    let ce = this.getCalculation('current-earnings');
    let cx = this.getCalculation('current-expenditure');

    let cs = ps + ce - cx;
    this.month.calculations.forEach((val, index) => {
      if (val.name == 'current-savings') {
        val.value = cs.toString();
      }
    });
    this.currentSavingsUpdated();
  }
  public currentSavingsUpdated() {
    let nd = this.getNextDate(this.month.monthYear, this.month.monthNumber);
    this.dataSource.previousSavingsObs.next({
      monthNumber: nd.monthNumber,
      monthYear: nd.monthYear,
      sum: this.getCalculation('current-savings').toString(),
    });
  }

  public getPreviousDate(
    monthYear: string,
    monthNumber: string
  ): { monthYear: string; monthNumber: string } {
    let temp = parseInt(monthNumber);
    let pm = temp == 1 ? '12' : (temp - 1).toString();

    let py = pm === '12' ? (parseInt(monthYear) - 1).toString() : monthYear;
    return { monthYear: py, monthNumber: pm };
  }

  public getNextDate(
    monthYear: string,
    monthNumber: string
  ): { monthYear: string; monthNumber: string } {
    let temp = parseInt(monthNumber);
    let nm = temp == 12 ? '1' : (temp + 1).toString();

    let ny = nm === '1' ? (parseInt(monthYear) + 1).toString() : monthYear;
    return { monthYear: ny, monthNumber: nm };
  }
}
