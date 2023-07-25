import { Component, OnInit } from '@angular/core';
import {
  Month,
  MonthCalculation,
  MonthNavigation,
  Table,
} from '../models/models';
import { MonthToNumberPipe } from '../Pipes/month-to-number.pipe';
import { TableDataService } from '../services/table-data.service';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.scss'],
})
export class MonthsComponent implements OnInit {
  public months: Month[] = [];
  public monthsToDisplay: Month[] = [];
  public monthNavigationList: MonthNavigation[] = [];

  constructor(public dataSource: TableDataService) {}
  ngOnInit(): void {
    this.dataSource.getMonthList().subscribe((res) => {
      for (let item of res) {
        this.addMonthByNumber(item.monthYear, item.monthNumber);
      }
      console.log(this.monthNavigationList);
      this.monthsToDisplay = this.months;
    });

    this.dataSource.monthNavigationSelectedObs.subscribe((res) => {
      this.monthsToDisplay = this.filterMonths(res.monthYear, res.monthNumber);
    });
  }

  public addNextMonth() {
    let nextyear: string = '';
    let nextMonth: string = '';

    if (this.months[0].monthNumber == '12') {
      nextMonth = '1';
      nextyear = (parseInt(this.months[0].monthYear) + 1).toString();
    } else {
      nextMonth = (parseInt(this.months[0].monthNumber) + 1).toString();
      nextyear = this.months[0].monthYear;
    }
    return this.addMonthByNumber(nextyear, nextMonth);
  }

  public addMonthByName(monthYear: string, monthName: string) {
    let monthNumber = new MonthToNumberPipe().transform(monthName);
    return this.addMonthByNumber(monthYear, monthNumber);
  }
  public addMonthByNumber(monthYear: string, monthNumber: string) {
    if (monthNumber != '0') {
      let earningsTable: Table = {
        tableName: 'earnings',
        columns: ['date', 'name', 'amount'],
        rows: [],
        isSaved: false,
      };

      let expTable: Table = {
        tableName: 'expenditure',
        columns: ['date', 'name', 'amount'],
        rows: [],
        isSaved: false,
      };

      let calcs: MonthCalculation[] = [
        {
          name: 'current-savings',
          value: '0',
          isSaved: false,
        },
        {
          name: 'current-expenditure',
          value: '0',
          isSaved: false,
        },
        {
          name: 'current-earnings',
          value: '0',
          isSaved: false,
        },
        {
          name: 'previous-savings',
          value: '0',
          isSaved: false,
        },
      ];

      let month: Month = {
        monthNumber: monthNumber,
        monthYear: monthYear,
        tables: [earningsTable, expTable],
        calculations: calcs,
        isSaved: false,
      };
      this.months.unshift(month);
      this.addMonthNavigation(monthYear, monthNumber);
      return true;
    }
    return false;
  }
  public addMonthNavigation(monthYear: string, monthNumber: string) {
    if (this.monthNavigationList.length === 0) {
      let firstMonthNavigation: MonthNavigation = {
        monthNumber: 'all',
        monthYear: 'all',
      };
      this.monthNavigationList.unshift(firstMonthNavigation);
    }
    let monthNavigation: MonthNavigation = {
      monthNumber: monthNumber,
      monthYear: monthYear,
    };
    this.monthNavigationList.splice(1, 0, monthNavigation);
    this.dataSource.monthNavigationObs.next(this.monthNavigationList);
  }

  public removeMonthNavigation(monthyear: string, monthNumber: string) {
    this.monthNavigationList.forEach((value, index) => {
      if (value.monthYear == monthyear && value.monthNumber == monthNumber) {
        this.monthNavigationList.splice(index, 1);
      }
    });
    this.dataSource.monthNavigationObs.next(this.monthNavigationList);
  }

  public deleteMonth(monthYear: string, monthName: string) {
    let monthNumber = new MonthToNumberPipe().transform(monthName);
    let response = confirm('Are you sure??');
    if (response) {
      this.months.forEach((month, index) => {
        if (month.monthNumber == monthNumber && month.monthYear == monthYear) {
          this.months.splice(index, 1);
          this.removeMonthNavigation(monthYear, monthNumber);
        }
      });
    }
  }

  public filterMonths(monthYear: string, monthNumber: string): Month[] {
    let filterData: Month[] = [];
    if (monthYear === 'all') {
      if (monthNumber === 'all') {
        filterData = this.months;
      } else {
        // later
      }
    } else {
      if (monthNumber === 'all') {
        // later
      } else {
        for (let month of this.months) {
          if (
            month.monthYear === monthYear &&
            month.monthNumber === monthNumber
          ) {
            filterData.push(month);
          }
        }
      }
    }
    return filterData;
  }
}
