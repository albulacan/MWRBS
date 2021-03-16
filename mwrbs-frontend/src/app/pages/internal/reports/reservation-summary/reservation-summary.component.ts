import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { ReservationMaster } from 'src/app/_interfaces/reservation-master';
import { RoomDetail } from 'src/app/_interfaces/room-detail';
import { CommonService } from 'src/app/_services/common.service';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import { ReservationService } from 'src/app/_services/reservation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation-summary',
  templateUrl: './reservation-summary.component.html',
  styleUrls: ['./reservation-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationSummaryComponent implements OnInit {

  private sub: any;
  referenceNo: string;
  isProcessing = false;
  reservation = new ReservationMaster();
  familyRoomRates = {} as RoomDetail;
  standardRoomRates = {} as RoomDetail;
  familyRateMultiplier = 0;
  standardRateMultiplier = 0;
  familyAdditionalHours = 0;
  standardAdditionalHours = 0;
  currentDate = new Date();

  constructor(private route: ActivatedRoute, private reservationService: ReservationService,
              private maintenanceService: MaintenanceService, public commonService: CommonService) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.referenceNo = params['referenceNo'];
      this.getReservationDetail();
    });
  }

  getRoomRate(i: number): RoomDetail {
    const roomTypeId = +this.reservation?.roomReservationDetails[i]?.roomTypeId;
    if (roomTypeId) {
      if (roomTypeId === 1) {
        return this.familyRoomRates;
      } else {
        return this.standardRoomRates;
      }
    }
    return {} as RoomDetail;
  }

  getRateMultiplier(i: number) {
    const roomTypeId = +this.reservation?.roomReservationDetails[i]?.roomTypeId;
    if (roomTypeId) {
      if (roomTypeId === 1) {
        return this.familyRateMultiplier;
      } else {
        return this.standardRateMultiplier;
      }
    }
    return 0;
  }

  getTotalAdditionalGuest(type: number) {
    let total = 0;
    this.reservation?.roomReservationDetails.forEach(x => {
      if (+x.roomTypeId === +type) {
        total += +x.additionalGuest;
      }
    });
    return total;
  }

  getTotalAdditionalMattress(type: number) {
    let total = 0;
    this.reservation?.roomReservationDetails.forEach(x => {
      if (+x.roomTypeId === +type) {
        total += +x.additionalMattress;
      }
    });
    return total;
  }

  print() {
    window.print();
  }

  // privates

  private getReservationDetail() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.getReservationByRefNo(this.referenceNo)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          if (httpResponse.body) {
            this.reservation = httpResponse.body;
            this.getRoomRates();
            this.getPayments(this.reservation.reservationId);
          } else {
            Swal.fire('Unable to get reservation details', 'Reference Number does not exist!');
          }
        } else {
          Swal.fire('Unable to get reservation details', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  private getRoomRates() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.maintenanceService.getRoomRates()
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const roomRates = httpResponse.body;
          if (roomRates?.length) {
            this.familyRoomRates = roomRates.find(x => +x.roomTypeId === 1);
            this.standardRoomRates = roomRates.find(x => +x.roomTypeId === 2);
          }
          const cid = new Date(this.reservation.checkInDate).getTime();
          const cod = new Date(this.reservation.checkOutDate).getTime();
          const bookingHours = Math.abs(cod - cid) / 3600000;
          if (this.familyRoomRates) {
            this.familyRateMultiplier = Math.floor(bookingHours / +this.familyRoomRates.rateEffectivity);
            this.familyAdditionalHours = Math.round(bookingHours % +this.familyRoomRates.rateEffectivity);
          }
          if (this.standardRoomRates) {
            this.standardRateMultiplier = Math.floor(bookingHours / +this.standardRoomRates.rateEffectivity);
            this.standardAdditionalHours = Math.round(bookingHours % +this.standardRoomRates.rateEffectivity);
          }
        } else {
          Swal.fire('Unable to get room rates', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  private getPayments(reservationId: number) {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.getPayments(reservationId)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.reservation.payments = httpResponse.body;
        } else {
          Swal.fire('Unable to get reservation payments', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  // getters

  get hasFamily() {
    if (this.reservation?.roomReservationDetails?.find(x => +x.roomTypeId === 1)) {
      return true;
    }
    return false;
  }

  get hasStandard() {
    if (this.reservation?.roomReservationDetails?.find(x => +x.roomTypeId === 2)) {
      return true;
    }
    return false;
  }

  get totalPayment() {
    let total = 0;
    this.reservation?.payments?.forEach(x => total = +total + +x.amount);
    return total;
  }

  get outstandingBalance() {
    const balance = +this.reservation?.grandTotal - +this.totalPayment;
    return balance > 0 ? balance : 0;
  }

}
