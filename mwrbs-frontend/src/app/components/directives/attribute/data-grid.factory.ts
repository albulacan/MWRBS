import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataGridServerService, DataGridOptions } from './data-grid-server.service';

@Injectable({
  providedIn: 'root'
})
export class DataGridFactory {
  constructor(private httpClient: HttpClient) {}

  post<T>(options: DataGridOptions<T>, searchValue: T) {
    return new DataGridServerService(options, this.httpClient, searchValue);
  }

  get<T>(options: DataGridOptions<T>) {
    return new DataGridServerService(options, this.httpClient);
  }
}
