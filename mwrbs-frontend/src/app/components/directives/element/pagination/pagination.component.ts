import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() maxPageIndex: number;
  @Input() rowChanged: Observable<number>;
  @Input() info: string;
  @Output() pageNumberChanged = new EventEmitter();
  currentPageNumber = 1;

  constructor() { }

  ngOnInit(): void {
    this.setCurrentPage(1);
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['maxPageIndex']) {
      const change = changes['maxPageIndex'];
      if (this.currentPageNumber > change.currentValue) {
        setTimeout(() => this.setCurrentPage(1), 1);
      }
    }
  }

  setCurrentPage(pageNumber: number, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    if (pageNumber === 0 || pageNumber > this.maxPageIndex
      || pageNumber === this.currentPageNumber) {
      return;
    }

    this.pageNumberChanged.emit(pageNumber);

    if (!this.rowChanged) {
      this.currentPageNumber = pageNumber;
    }
  }

  range(min: number, max: number): number[] {
    const result = [];
    for (let i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  }

  get pageStartNumber(): number {
    const startNumber = this.currentPageNumber <= 4
      ? 1
      : this.currentPageNumber >= this.maxPageIndex - 3
        ? this.maxPageIndex - 6
        : this.currentPageNumber - 3;
    return startNumber < 1 ? 1 : startNumber;
  }

  get pageEndNumber(): number {
    const pageEnd = this.pageStartNumber + 6;
    return pageEnd > this.maxPageIndex ? this.maxPageIndex : pageEnd;
  }

}
