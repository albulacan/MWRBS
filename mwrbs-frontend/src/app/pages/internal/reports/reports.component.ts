import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  reportTypeId: number | string = '';
  dateFrom: Date;
  dateTo: Date;
  referenceNo: '';
  reportTypes = [
    {
      reportTypeId: 1,
      reportTypeName: 'Reservations'
    },
    {
      reportTypeId: 2,
      reportTypeName: 'Reservation Summary'
    },
    {
      reportTypeId: 3,
      reportTypeName: 'Sales Report'
    }
  ];

  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  generate() {
    const form = document.getElementById('frm-date-range') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    let url = '';
    const baseUrl = this.location.prepareExternalUrl(this.location.path());
    if (+this.reportTypeId === 1) {
      url = `${baseUrl}/reservations/${this.dateFrom.toISOString()}/${this.dateTo.toISOString()}`;
    } else if (+this.reportTypeId === 2) {
      url = `${baseUrl}/summary/${this.referenceNo}`;
    } else if (+this.reportTypeId === 3) {
      url = `${baseUrl}/payments/${this.dateFrom.toISOString()}/${this.dateTo.toISOString()}`;
    }
    window.open(url);
  }

}

export interface ReportType {
  reportTypeId: number;
  reportTypeName: string;
}
