import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataGridServerService } from 'src/app/components/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/components/directives/attribute/data-grid.factory';
import { ReservationPayment } from 'src/app/_interfaces/reservation-payment';
import { CommonService } from 'src/app/_services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./payments-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentsReportComponent implements OnInit {

  private sub: any;
  request = {} as ReservationPayment;
  dataGrid: DataGridServerService<ReservationPayment>;
  currentDate = new Date();

  constructor(private route: ActivatedRoute, private dgFactory: DataGridFactory, public commonService: CommonService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.request.dateFrom = params['dateFrom'];
      this.request.dateTo = params['dateTo'];

      const url = `${environment.apiUrl}reservation/get-reservation-payments-by-date`;
      this.dataGrid = this.dgFactory.post({url}, this.request);
    });
  }

  print() {
    window.print();
  }

  get total() {
    if (!this.dataGrid?.itemsOnCurrentPage?.length) {
      return;
    }
    let total = 0;
    this.dataGrid.itemsOnCurrentPage.forEach(x => total = +total + +x.amount);
    return total;
  }

}
