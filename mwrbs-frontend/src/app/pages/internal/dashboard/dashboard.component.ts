import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { ReservationMaster } from 'src/app/_interfaces/reservation-master';
import { ReservationPayment } from 'src/app/_interfaces/reservation-payment';
import { RoomDetail } from 'src/app/_interfaces/room-detail';
import { CommonService } from 'src/app/_services/common.service';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import { ReservationService } from 'src/app/_services/reservation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isReservationsProcessing = false;
  isPaymentsProcessing = false;
  isRoomMasterProcessing = false;

  todaysReservations = [] as ReservationMaster[];
  totalReservations = 0;
  reservationsFromThePastWeek = 0;
  totalSales = 0;
  salesPercentageFromThePastWeek = 0;
  roomsUnderMaintenance = 0;
  occupiedRooms = 0;

  constructor(private reservationService: ReservationService, private maintenanceService: MaintenanceService,
              public commonService: CommonService) { }

  ngOnInit() {
    this.getReservations();
    this.getReservationPayments();
    this.getRoomMasters();
  }

  roomType(i: number) {
    let roomType = 0;
    this.todaysReservations[i]?.roomReservationDetails?.forEach((x, y) => {
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

  private getReservations() {
    this.isReservationsProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.getReservations()
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const reservations = httpResponse.body as ReservationMaster[];
          if (!reservations?.length) {
            this.isReservationsProcessing = false;
            return;
          }
          this.totalReservations = reservations.length;
          this.todaysReservations = reservations.filter(x => {
            const tmpDate = new Date(x.createdOn);
            if (tmpDate.toDateString() === new Date().toDateString()) {
              return true;
            }
            return false;
          });
          this.reservationsFromThePastWeek = reservations.filter(x => {
            let lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            lastWeek = new Date(lastWeek.toDateString());
            const tmpDate = new Date(x.createdOn);
            if (tmpDate >= lastWeek) {
              return true;
            }
            return false;
          })?.length || 0;
        } else {
          Swal.fire('Unable to get reservations', httpResponse?.message, 'error');
        }
        this.isReservationsProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isReservationsProcessing = false;
        });
  }

  private getReservationPayments() {
    this.isPaymentsProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.getReservationPayments()
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const payments = httpResponse.body as ReservationPayment[];
          if (!payments?.length) {
            this.isPaymentsProcessing = false;
            return;
          }
          payments.forEach(x => this.totalSales = +this.totalSales + +x.amount);
          let totalPaymentsFromThePastWeek = 0;
          payments.forEach(x => {
            let lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            lastWeek = new Date(lastWeek.toDateString());
            const tmpDate = new Date(x.createdOn);
            if (tmpDate >= lastWeek) {
              totalPaymentsFromThePastWeek = +totalPaymentsFromThePastWeek + +x.amount;
            }
          });
          if (+totalPaymentsFromThePastWeek) {
            this.salesPercentageFromThePastWeek = +this.totalSales / +totalPaymentsFromThePastWeek;
          }
        } else {
          Swal.fire('Unable to get reservation payments', httpResponse?.message, 'error');
        }
        this.isPaymentsProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isPaymentsProcessing = false;
        });
  }

  private getRoomMasters() {
    this.isRoomMasterProcessing = true;
    let httpResponse: IHttpResponse;
    this.maintenanceService.getRoomMasters()
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const rooms = httpResponse.body as RoomDetail[];
          if (!rooms?.length) {
            this.isRoomMasterProcessing = false;
            return;
          }
          this.roomsUnderMaintenance = rooms.filter(x => x.roomStatusName === 'Unavailable')?.length || 0;
          this.occupiedRooms = rooms.filter(x => x.roomStatusName === 'Occupied')?.length || 0;
        } else {
          Swal.fire('Unable to get room masters', httpResponse?.message, 'error');
        }
        this.isRoomMasterProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isRoomMasterProcessing = false;
        });
  }

}
