import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonthNavigation } from '../models/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  public monthNavigationObs = new Subject<MonthNavigation[]>();
  public monthNavigationSelectedObs = new Subject<MonthNavigation>();

  public previousSavingsObs = new Subject<{
    monthYear: string;
    monthNumber: string;
    sum: string;
  }>();

  public currentSavingsRequestObs = new Subject<{
    monthYear: string;
    MonthNumber: string;
  }>();
  constructor(private http: HttpClient) {}
  public getMonthList() {
    return this.http.get<any>(
      'https://localhost:7184/api/MonthsData/GetListOfMonth'
    );
  }

  public getTableRows(
    monthYear: string,
    monthNumber: string,
    tableName: string
  ) {
    let parameters = new HttpParams();
    parameters = parameters.append('monthYear', monthYear);
    parameters = parameters.append('monthNumber', monthNumber);
    parameters = parameters.append('tableName', tableName);

    return this.http.get<any>(
      'https://localhost:7184/api/MonthsData/GetTableData',
      {
        params: parameters,
      }
    );
  }

  public postTableRow(monthDataForBackend: any) {
    return this.http.post(
      'https://localhost:7184/api/MonthsData/InsertTableRow',
      monthDataForBackend,
      { responseType: 'text' }
    );
  }

  public deleteTableRow(rowId: number) {
    return this.http.delete(
      'https://localhost:7184/api/MonthsData/DeleteTableRow/' + rowId,
      { responseType: 'text' }
    );
  }
}
