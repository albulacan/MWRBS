import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataGridServerService } from 'src/app/components/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/components/directives/attribute/data-grid.factory';
import { ReservationMaster } from 'src/app/_interfaces/reservation-master';
import { CommonService } from 'src/app/_services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reservations-report',
  templateUrl: './reservations-report.component.html',
  styleUrls: ['./reservations-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationsReportComponent implements OnInit {

  private sub: any;
  request = {} as ReservationMaster;
  dataGrid: DataGridServerService<ReservationMaster>;
  currentDate = new Date();

  constructor(private route: ActivatedRoute, private dgFactory: DataGridFactory, public commonService: CommonService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.request.dateFrom = params['dateFrom'];
      this.request.dateTo = params['dateTo'];

      const url = `${environment.apiUrl}reservation/get-reservations-by-date`;
      this.dataGrid = this.dgFactory.post({url}, this.request);
    });
  }

  guests(i: number) {
    let guests = 0;
    this.dataGrid?.itemsOnCurrentPage[i]?.roomReservationDetails?.forEach(x => guests += +x.noOfGuest);
    return guests;
  }

  roomType(i: number) {
    let roomType = 0;
    this.dataGrid?.itemsOnCurrentPage[i]?.roomReservationDetails?.forEach((x, y) => {
      if (y === 0) {
        roomType = +x.roomTypeId;
      } else {
        if (roomType === 0) {
          return;
        }
        if (+x.roomTypeId !== roomType) {
          roomType = 0;
        }
      }
    });
    if (roomType === 0) {
      return 'Family Room & Standard Room';
    } else if (roomType === 1) {
      return 'Family Room';
    } else if (roomType === 2) {
      return 'Standard Room';
    } else {
      return '';
    }
  }

  print() {
    window.print();
  }

  getRoomTypeName(id: number) {
    if (+id === 1) {
      return 'Family Room';
    } else if (+id === 2) {
      return 'Standard Room';
    } else {
      return '';
    }
  }

}
