import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService } from 'src/app/components/directives/attribute/bs-modal.service';
import { ReservationDetailComponent } from 'src/app/components/reservation-detail/reservation-detail.component';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { PaymentDetail } from 'src/app/_interfaces/payment-detail';
import { ReservationMaster } from 'src/app/_interfaces/reservation-master';
import { ReservationPayment } from 'src/app/_interfaces/reservation-payment';
import { RoomDetail } from 'src/app/_interfaces/room-detail';
import { CommonService } from 'src/app/_services/common.service';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import { ReservationService } from 'src/app/_services/reservation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check-reservation',
  templateUrl: './check-reservation.component.html',
  styleUrls: ['./check-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckReservationComponent implements OnInit {

  @ViewChild(ReservationDetailComponent, { static: false }) reservationDetail: ReservationDetailComponent;

  isProcessing = false;
  reservationModel = new ReservationMaster();

  paymentModal: BsModalService;
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
  noAvailableRoomMessage = '';
  availableRooms = [] as RoomDetail[];

  tmpReservationDetails = '';

  constructor(public commonService: CommonService, private maintenanceService: MaintenanceService,
              private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.max.setFullYear(this.max.getFullYear() + 1);
    window.onbeforeunload = (e: any) => {
      const dialogText = 'Are you sure you want to leave this page? Unsaved details will be lost';
      e.returnValue = dialogText;
      return dialogText;
    };
  }

  checkStatus() {
    const form = document.getElementById('frm-reference-no') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    this.getReservationDetails();
  }

  disableTime() {
    const elements = document.querySelectorAll('.owl-dt-timer-input, .owl-dt-control-button.owl-dt-timer-hour12-box');
    if (elements?.length) {
      elements.forEach(x => {
        x.setAttribute('disabled', 'true');
      });
    }
  }

  newPayment() {
    this.payment.paymentTypeId = '';
    this.payment.accountName = '';
    this.payment.accountNumber = '';
    this.payment.amount = '';
    this.paymentDetail.accountName = '';
    this.paymentDetail.accountNumber = '';
    this.paymentModal.open();
  }

  closePaymentModal() {
    document.getElementById('frm-payment').classList.remove('was-validated');
    this.paymentModal.close();
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

  onFileSelected(event: any) {
    this.getBase64(event).then((data: ReservationPayment) => {
      this.payment.file = (data && data.file) || null;
    });
  }

  addPayment() {
    const form = document.getElementById('frm-payment') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    this.payment.paymentTypeName = this.commonService.defaultValues.paymentTypes
      .find(x => +x.paymentTypeId === +this.payment.paymentTypeId).paymentTypeName;
    this.payment.createdOn = new Date();
    this.reservationModel.payments.push(this.payment);
    this.closePaymentModal();
  }

  save() {
    const form = document.getElementById('frm-reservation-details') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    Swal.fire({
      title: 'Update Reservation',
      html: `You are about to update your reservation. Do you want to proceed?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateReservation();
      }
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

  private getReservationDetails() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.getReservationByRefNo(this.reservationModel.referenceNumber)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          if (httpResponse.body) {
            this.reservationModel = httpResponse.body;
            this.tmpReservationDetails = JSON.stringify(httpResponse.body);
            this.getAvailableRooms();
          } else {
            this.reservationModel = new ReservationMaster();
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

  private updateReservation() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.updateDetail(this.reservationModel)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'Reservation details successfully saved!', 'success');
        } else {
          Swal.fire('Unable to save reservation details', httpResponse?.message, 'error');
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

  get min() {
    let date = new Date(new Date().toDateString());
    if (!this.reservationModel?.checkInDate) {
      return date;
    }
    const checkInDate = new Date(this.reservationModel.checkInDate);
    if (checkInDate > date) {
      if (new Date().getHours() > 14) {
        date.setDate(date.getDate() + 1);
        return date;
      } else {
        return date;
      }
    }
    date = new Date(this.reservationModel.checkInDate);
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

  get totalPayment() {
    if (!this.reservationModel?.payments?.length) {
      return 0;
    }
    let total = 0;
    this.reservationModel.payments.forEach(x => total = +total + +x.amount);
    return total;
  }

  get outstandingBalance() {
    if (!+this.reservationModel?.grandTotal) {
      return 0;
    }
    return +this.reservationModel.grandTotal - +this.totalPayment;
  }

  get isDisabledStatus() {
    return +this.reservationModel.statusId === 3 || +this.reservationModel.statusId === 4
      || +this.reservationModel.statusId === 5 || +this.reservationModel.statusId === 6;
  }

  get paymentTypes() {
    if (!this.commonService?.defaultValues?.paymentTypes?.length) {
      return [];
    }
    return this.commonService.defaultValues.paymentTypes.filter(x => +x.paymentTypeId !== 1);
  }

  get isReservationValidated() {
    const form = document.getElementById('frm-reservation-details') as HTMLFormElement;
    if (!form) {
      return false;
    }
    return form?.classList?.contains('was-validated') || false;
  }

  get hasChanges() {
    const reservation = JSON.parse(JSON.stringify(this.reservationModel)) as ReservationMaster;
    if (this.tmpReservationDetails !== JSON.stringify(reservation)) {
      return true;
    }
    return false;
  }

}
