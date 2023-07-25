import { Component, OnInit } from '@angular/core';
import { MonthNavigation } from '../models/models';
import { TableDataService } from '../services/table-data.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  public navigationList!: MonthNavigation[];
  constructor(public dataSource: TableDataService) {
    this.navigationList = [];
  }
  ngOnInit(): void {
    this.dataSource.monthNavigationObs.subscribe((res) => {
      this.navigationList = res;
    });
  }
  public newMonthNavigationClicked(event: any) {
    let monthNavigation: MonthNavigation = {
      monthNumber: event.monthNumber,
      monthYear: event.monthYear,
    };
    this.dataSource.monthNavigationSelectedObs.next(monthNavigation);
  }
}
