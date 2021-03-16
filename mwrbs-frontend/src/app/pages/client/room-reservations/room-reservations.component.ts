import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { PaymentDetail } from 'src/app/_interfaces/payment-detail';
import { ReservationMaster } from 'src/app/_interfaces/reservation-master';
import { ReservationPayment } from 'src/app/_interfaces/reservation-payment';
import { CommonService } from 'src/app/_services/common.service';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import { ReservationService } from 'src/app/_services/reservation.service';
import { ReservationDetailComponent } from 'src/app/components/reservation-detail/reservation-detail.component';
import Swal from 'sweetalert2';
import { RoomDetail } from 'src/app/_interfaces/room-detail';

@Component({
  selector: 'app-room-reservations',
  templateUrl: './room-reservations.component.html',
  styleUrls: ['./room-reservations.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoomReservationsComponent implements OnInit {

  @ViewChild(ReservationDetailComponent, { static: false }) reservationDetail: ReservationDetailComponent;

  pageNumber: number;
  isProcessing = false;

  reservationModel = new ReservationMaster();
  payment = {
    paymentTypeId: '',
    accountName: '',
    accountNumber: '',
    amount: ''
  } as ReservationPayment;
  paymentDetail = {
    accountName: '',
    accountNumber: ''
  } as PaymentDetail;
  payLater = false;
  noAvailableRoomMessage = '';
  availableRooms = [] as RoomDetail[];

  constructor(public commonService: CommonService, private maintenanceService: MaintenanceService,
              private reservationService: ReservationService) { }

  ngOnInit() {
    this.pageNumber = 1;
  }

  nextPage() {
    let formId = '';
    if (+this.pageNumber === 2) {
      formId = 'frm-guest-informatiion';
    } else if (+this.pageNumber === 1) {
      formId = 'frm-reservation-details';
    }
    const form = document.getElementById(formId) as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    this.pageNumber += 1;
  }

  prevPage() {
    this.pageNumber -= 1;
  }

  disableTime() {
    const elements = document.querySelectorAll('.owl-dt-timer-input, .owl-dt-control-button.owl-dt-timer-hour12-box');
    if (elements?.length) {
      elements.forEach(x => {
        x.setAttribute('disabled', 'true');
      });
    }
  }

  submit() {
    if (this.payLater) {
      document.getElementById('frm-payment-details').classList.remove('was-validated');
      this.reservationModel.payments = [];
    } else {
      const form = document.getElementById('frm-payment-details') as HTMLFormElement;
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        return;
      }
    }
    if (!this.payLater) {
      this.reservationModel.payments = [];
      this.reservationModel.payments.push(this.payment);
    }
    Swal.fire({
      title: 'Submit Reservation',
      html: `You are about to submit a reservation${this.payLater ? ' without payment.' : '.'} Do you want to proceed?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.addReservation();
      }
    });
  }

  onFileSelected(event: any) {
    this.getBase64(event).then((data: ReservationPayment) => {
      this.payment.file = (data && data.file) || null;
    });
  }

  onPaymentTypeChange() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.maintenanceService.getPaymentDetail(+this.payment.paymentTypeId)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          if (httpResponse.body) {
            this.paymentDetail = httpResponse.body;
          } else {
            this.paymentDetail.accountName = '';
            this.paymentDetail.accountNumber = '';
            this.paymentDetail.modifiedBy = '';
            this.paymentDetail.modifiedOn = '';
          }
        } else {
          Swal.fire('Unable to get payment details', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  getAvailableRooms() {
    if (!this.reservationModel.checkInDate || !this.reservationModel.checkOutDate) {
      return;
    }
    this.availableRooms = [];
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.getAvailableRooms(this.reservationModel)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.availableRooms = httpResponse?.body as RoomDetail[];
          if (!this.availableRooms?.length) {
            this.noAvailableRoomMessage = 'Sorry, no avaiable rooms for the selected Room Type and Check-In and Out Dates. Kindly select another date.';
          } else {
            let unavailableRoom = '';
            this.reservationModel.roomReservationDetails.forEach(x => {
              if (unavailableRoom) {
                return;
              }
              if (!this.availableRooms.filter(y => +y.roomTypeId === +x.roomTypeId)?.length) {
                unavailableRoom = +x.roomTypeId === 1 ? 'Family Room' : 'Standard Room';
              }
            });
            if (unavailableRoom) {
              this.noAvailableRoomMessage = `Sorry, no avaiable ${unavailableRoom} for the selected Check-In and Out Dates. Kindly select another date or room type.`;
            } else {
              const selectedFamilyRooms = this.reservationDetail?.getSelectedRoomTypeCount(1);
              const selectedStandardRooms = this.reservationDetail?.getSelectedRoomTypeCount(2);
              const availableFamilyRooms = this.availableRooms?.filter(x => +x.roomTypeId === 1)?.length || 0;
              const availableStandardRooms = this.availableRooms?.filter(x => +x.roomTypeId === 2)?.length || 0;
              if (+selectedFamilyRooms > +availableFamilyRooms) {
                this.noAvailableRoomMessage = 'Sorry, there is not enough available Family Rooms for the selected Check-In and Out Dates. Kindly select another date or room type.';
              } else if (+selectedStandardRooms > +availableStandardRooms) {
                this.noAvailableRoomMessage = 'Sorry, there is not enough available Standard Rooms for the selected Check-In and Out Dates. Kindly select another date or room type.';
              } else {
                this.noAvailableRoomMessage = '';
              }
            }
          }
        } else {
          Swal.fire('Unable to get available rooms', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isProcessing = false;
        });
  }

  clearCheckOutDate() {
    if (this.reservationModel) {
      this.reservationModel.checkOutDate = null;
    }
  }

  isCapacityExceeded() {
    if (this.reservationDetail?.isCapacityExceeded) {
      return true;
    } else {
      return false;
    }
  }

  getRoomCapacity(type: number = 2) {
    let rates = this.reservationDetail?.standardRoom;
    if (+type === 1) {
      rates = this.reservationDetail?.familyRoom;
    }
    if (rates) {
      if (!+rates?.capacity || !+rates?.additionalGuestCapacity) {
        return '0';
      }
      return `${rates?.capacity} - ${+rates?.capacity + +rates?.additionalGuestCapacity}`;
    } else {
      return '0';
    }
  }

  getAccountNumberPattern() {
    if (+this.payment.paymentTypeId === 2) {
      return '^(09|\\+639)\\d{9}$'; // GCASH
    } else if (+this.payment.paymentTypeId === 3) {
      return '^[0-9]{10}$'; // BPI
    } else if (+this.payment.paymentTypeId === 4) {
      return '^[0-9]{12}$'; // BDO
    } else {
      return '';
    }
  }

  // privates

  private addReservation() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.addReservation(this.reservationModel)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const referenceNo = httpResponse?.body?.referenceNumber;
          Swal.fire('Success', `Reservation successfully added with reference number <strong>${referenceNo}</strong>! Kindly expect an email containing the details of your reservation.`, 'success');
          this.reservationModel = new ReservationMaster();
          this.pageNumber = 1;
        } else {
          Swal.fire('Unable to add reservation', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  private getBase64(event: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          const data = {} as ReservationPayment;
          data.file = reader.result.toString();
          resolve(data);
        };
        reader.onerror = error => reject(error);
      } else {
        resolve(null);
      }
    });
  }

  // getters

  get min() {
    const date = new Date(new Date().toDateString());
    if (new Date().getHours() > 14) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }

  get max() {
    const date = new Date(new Date().toDateString());
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }

  get checkInStart() {
    const date = this.min;
    date.setHours(14);
    return date;
  }

  get checkOutMin() {
    if (!this.reservationModel.checkInDate) {
      return this.min;
    }
    const cid = new Date(this.reservationModel.checkInDate);
    const date = new Date(cid.toDateString());
    date.setDate(date.getDate() + 1);
    date.setHours(12);
    return date;
  }

  get checkOutMax() {
    if (!this.reservationModel.checkInDate) {
      return this.min;
    }
    const cid = new Date(this.reservationModel.checkInDate);
    const date = new Date(cid.toDateString());
    date.setMonth(date.getMonth() + 1);
    date.setHours(12);
    return date;
  }

  get paymentTypes() {
    if (!this.commonService?.defaultValues?.paymentTypes?.length) {
      return [];
    }
    return this.commonService.defaultValues.paymentTypes.filter(x => +x.paymentTypeId !== 1);
  }

  get isFutureReservation() {
    const cid = new Date(this.reservationModel.checkInDate);
    const date = new Date(new Date().toDateString());
    date.setDate(date.getDate() + 3);
    if (cid >= date) {
      return true;
    }
    return false;
  }

  get isTodayReservation() {
    if (!this?.reservationModel?.checkInDate) {
      return false;
    }
    const cid = new Date(this.reservationModel?.checkInDate?.toDateString());
    const today = new Date(new Date().toDateString());
    if (cid.toDateString() === today.toDateString()) {
      return true;
    }
    return false;
  }

}
