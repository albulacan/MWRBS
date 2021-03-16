import { HttpClient, HttpResponse } from '@angular/common/http';

export class DataGridServerService<T> {
  searchValue: T = {} as T;
  serverResponse: DataGridResponse<T> = {
    data: [],
    recordsTotal: 0,
    draw: 0
  };
  additionalParam: any;
  draw = 0;
  isProcessing = false;
  callback: any;
  sortConditions = [] as SortCondition[];

  private _currentPageIndex = 1;
  public get currentPageIndex(): number {
    return this._currentPageIndex;
  }
  public set currentPageIndex(v: number) {
    this._currentPageIndex = v;
    this.load();
  }

  private _pageSize: number;
  public get pageSize(): number {
    return this._pageSize;
  }
  public set pageSize(v: number) {
    this._pageSize = v;
    this.load();
  }

  constructor(
    private options: DataGridOptions<T>,
    private httpClient: HttpClient,
    private searchVal?: T
  ) {
    this._pageSize = options.pageSize || 10;
    if (searchVal) {
      this.searchValue = searchVal;
    }
    if (options.callback) {
      this.callback = options.callback;
    }
    if (options.initialize && options.initialize === 1) {
      const json = {
        data: [] as T[],
        recordsTotal: 0,
        draw: this.draw
      };
      this.serverResponse = json as DataGridResponse<T>;
    } else {
      if (httpClient) {
        this.load();
      }
    }
  }


  clear() {
    this.isProcessing = false;
    this.serverResponse = {
      data: [],
      recordsTotal: 0,
      draw: this.draw
    };
  }

  load(search?: boolean, callback?: any) {
    this.isProcessing = true;
    this.httpClient
      .post<HttpResponse<DataGridResponse>>(this.options.url, this.buildQuery(search))
      .subscribe((data: any) => {
        if (this.callback) {
          this.callback(data);
        }

        if (callback) {
          callback(data);
        }

        if (!data.body) {
          data.body = {
            data: [],
            recordsTotal: 0,
            draw: this.draw
          };
        }
        this.isProcessing = false;
        const json = data.body as DataGridResponse<T>;
        this.serverResponse = json;
      });
  }

  sort(field: string) {
    if (!this.serverResponse?.data?.length) {
      return;
    }
    let isAsc = false;
    if (this.sortConditions.find(x => x.field === field)) {
      this.sortConditions.map(x => {
        if (x.field === field) {
          x.isAsc = !x.isAsc;
          isAsc = x.isAsc;
        }
      });
    } else {
      this.sortConditions.push({ field, isAsc: true });
      isAsc = true;
    }
    this.serverResponse.data = this.serverResponse.data.sort((a, b) => {
      if (isNaN(+a[field])) {
        const strA = a[field] as string;
        const strB = b[field] as string;
        if (this.isDate(strA)) {
          if (Date.parse(strA) > Date.parse(strB)) {
            return isAsc ? 1 : -1;
          }
          if (Date.parse(strB) > Date.parse(strA)) {
            return isAsc ? -1 : 1;
          }
        } else {
          const result = strA.localeCompare(strB);
          if (!result || isAsc) {
            return result;
          } else {
            return result === 1 ? -1 : 1;
          }
        }
      } else {
        if (+a[field] > +b[field]) {
          return isAsc ? 1 : -1;
        }
        if (+b[field] > +a[field]) {
          return isAsc ? -1 : 1;
        }
      }
      return 0;
    });
  }

  getSortIcon(field: string) {
    let iconClass = 'fa fa-sort';
    if (!this.sortConditions?.length) {
      return iconClass;
    }
    const sc = this.sortConditions.find(x => x.field === field);
    if (!sc) {
      return iconClass;
    }
    if (sc.isAsc) {
      iconClass = 'fa fa-sort-amount-asc';
    } else {
      iconClass = 'fa fa-sort-amount-desc';
    }
    return iconClass;
  }

  buildQuery(search: boolean) {
    this.draw++;
    const param = Object.assign({
      draw: this.draw,
      search: this.searchValue,
      length: this.pageSize,
      start: search ? 0 : this.startRow
    },
      this.additionalParam);
    return param as DataGridRequest;
  }

  get totalRows(): number {
    return this.serverResponse.recordsTotal;
  }

  get totalFilteredRows(): number {
    return this.serverResponse.recordsTotal;
  }

  get itemsOnCurrentPage(): T[] {
    return this.serverResponse.data;
  }

  get startRow(): number {
    if (this.currentPageIndex === 0) {
      return 0;
    }

    return (this.currentPageIndex - 1) * this.pageSize;
  }

  get maxPageIndex(): number {
    const index = Math.ceil(this.totalFilteredRows / this.pageSize);
    return index;
  }

  get info() {
    return `Showing ${this.currentRowStart} to ${this.currentRowEnd} out of ${this.totalRows} Record/s`;
  }

  private get currentRowStart(): number {
    return this.totalRows > this.pageSize
      ? this.startRow + 1
      : this.totalRows === 0
        ? 0
        : 1;
  }
  private get currentRowEnd(): number {
    return this.startRow + this.pageSize < this.totalRows
      ? this.startRow + this.pageSize
      : this.totalRows;
  }

  private isDate(value: any) {
    const parsedDate = Date.parse(value);
    if (isNaN(value) && !isNaN(parsedDate)) {
      return true;
    }
    return false;
  }
}

export interface DataGridResponse<T = any> {
  draw: number;
  recordsTotal: number;
  data: T[];
}

export interface DataGridRequest {
  draw: number;
  search: any;
  length: number;
  start: number;
  query: any;
}

export interface DataGridOptions<T> {
  initialize?: number;
  url: string;
  pageSize?: number;
  items?: T[];
  serverSideProcessing?: boolean;
  callback?: any;
}

export interface SortCondition {
  field: string;
  isAsc: boolean;
}

