import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService } from 'src/app/components/directives/attribute/bs-modal.service';
import { DataGridServerService } from 'src/app/components/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/components/directives/attribute/data-grid.factory';
import { BsSelectComponent, BsSelectOption } from 'src/app/components/directives/element/bs-select/bs-select.component';
import { ReservationDetailComponent } from 'src/app/components/reservation-detail/reservation-detail.component';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { ReservationMaster, RoomAssignment } from 'src/app/_interfaces/reservation-master';
import { ReservationPayment } from 'src/app/_interfaces/reservation-payment';
import { RoomDetail } from 'src/app/_interfaces/room-detail';
import { CommonService } from 'src/app/_services/common.service';
import { ReservationService } from 'src/app/_services/reservation.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationsComponent implements OnInit {

  @ViewChild(ReservationDetailComponent, { static: false }) reservationDetail: ReservationDetailComponent;
  @ViewChild(BsSelectComponent, { static: false }) bsSelect: BsSelectComponent;

  filter = new ReservationMaster();
  reservationsDataGrid: DataGridServerService<ReservationMaster>;
  modal: BsModalService;
  reservationMaster = new ReservationMaster();
  isProcessing = false;
  initReservation = false;
  isAvailableRoomsProcessing = false;
  paymentModal: BsModalService;
  payment = {} as ReservationPayment;
  tmpReservationDetails: string;
  availableRooms = [] as BsSelectOption[];
  assignedRooms = [] as BsSelectOption[];
  origAvailableRooms = [] as RoomDetail[];

  constructor(private dgFactory: DataGridFactory, public commonService: CommonService,
              private reservationService: ReservationService) { }

  ngOnInit() {
    const url = `${environment.apiUrl}reservation/get-dg`;
    this.reservationsDataGrid = this.dgFactory.post({ url }, this.filter);
  }

  roomType(i: number) {
    let roomType = 0;
    this.reservationsDataGrid?.itemsOnCurrentPage[i]?.roomReservationDetails?.forEach((x, y) => {
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

  new() {
    this.reservationMaster = new ReservationMaster();
    this.initReservation = true;
    this.availableRooms = [];
    this.assignedRooms = [];
    this.bsSelect?.load(true);
    const hideTime = document.getElementById('hide-time') as HTMLLinkElement;
    if (hideTime) {
      hideTime.disabled = false;
    }
    this.modal.open();
  }

  view(referenceNo: string) {
    this.getReservationDetail(referenceNo);
    this.initReservation = true;
    this.availableRooms = [];
    this.assignedRooms = [];
    this.modal.open();
  }

  newPayment() {
    this.payment.paymentTypeId = '';
    this.payment.accountName = '';
    this.payment.accountNumber = '';
    this.payment.file = '';
    this.payment.attachmentPath = '';
    this.payment.amount = 0;
    this.paymentModal.open();
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
    this.reservationMaster.payments.push(this.payment);
    this.closePaymentModal();
  }

  closePaymentModal() {
    document.getElementById('frm-payment').classList.remove('was-validated');
    this.paymentModal.close();
  }

  add() {
    const frmGuestInfo = document.getElementById('frm-guest-information') as HTMLFormElement;
    frmGuestInfo.classList.add('was-validated');
    const frmReservationDetails = document.getElementById('frm-reservation-details') as HTMLFormElement;
    frmReservationDetails.classList.add('was-validated');
    if (!frmGuestInfo.checkValidity() || !frmReservationDetails.checkValidity()) {
      return;
    }
    if (this.reservationMaster.assignedRooms?.length) {
      if (!this.validateRoomAssignment()) {
        Swal.fire({
          title: 'Unable to Add Reservation',
          html: 'Please assign a room to the selected room/s',
          icon: 'error'
        });
        return;
      }
      this.reservationMaster.statusId = 2;
      this.reservationMaster.modifiedBy = this.commonService?.activeUser?.username;
    }
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.addReservation(this.reservationMaster)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const referenceNo = httpResponse?.body?.referenceNumber;
          Swal.fire('Success', `Reservation successfully added with reference number <strong>${referenceNo}</strong>!`, 'success');
          this.reservationsDataGrid.load();
          this.close();
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

  getAvailableRooms(resetSelection: boolean = false) {
    if (!this.reservationMaster.checkInDate || !this.reservationMaster.checkOutDate) {
      return;
    }
    this.isAvailableRoomsProcessing = true;
    this.availableRooms = [];
    this.origAvailableRooms = [];
    let httpResponse: IHttpResponse;
    this.reservationService.getAvailableRooms(this.reservationMaster)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.origAvailableRooms = httpResponse.body as RoomDetail[];
          this.origAvailableRooms.forEach(x => {
            const maxOption = this.reservationMaster?.roomReservationDetails?.filter(y => +y.roomTypeId === +x.roomTypeId)?.length;
            const option = {group: x.roomTypeName, maxOption, id: x.roomMasterId, name: x.roomName} as BsSelectOption;
            this.availableRooms.push(option);
          });
          this.bsSelect?.load(resetSelection);
        } else {
          Swal.fire('Unable to get available rooms', httpResponse?.message, 'error');
        }
        this.isAvailableRoomsProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
          this.isAvailableRoomsProcessing = false;
        });
  }

  setReservationAssignedRooms(data: BsSelectOption[]) {
    this.assignedRooms = data;
    this.reservationMaster.assignedRooms = [];
    this.assignedRooms.forEach(x => {
      const room = new RoomAssignment();
      room.roomMasterId = x.id;
      this.reservationMaster.assignedRooms.push(room);
    });
  }

  onFileSelected(event: any) {
    this.getBase64(event).then((data: ReservationPayment) => {
      this.payment.file = (data && data.file) || null;
    });
  }

  approve() {
    if (!this.validateRoomAssignment()) {
      Swal.fire({
        title: 'Unable to Approve Reservation',
        html: 'Please assign a room to the selected room/s',
        icon: 'error'
      });
      return;
    }
    Swal.fire({
      title: 'Approve Reservation',
      html: `Are you sure you want to approve reservation <strong>${this.reservationMaster.referenceNumber}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationMaster.statusId = 2;
        this.reservationMaster.modifiedBy = this.commonService.activeUser?.username;
        this.setStatus();
      }
    });
  }

  disapprove() {
    Swal.fire({
      title: 'Disapprove Reservation',
      html: `Are you sure you want to disapprove reservation <strong>${this.reservationMaster.referenceNumber}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Disapprove'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationMaster.statusId = 4;
        this.reservationMaster.modifiedBy = this.commonService.activeUser?.username;
        this.setStatus();
      }
    });
  }

  cancel() {
    Swal.fire({
      title: 'Cancel Reservation',
      html: `Are you sure you want to cancel reservation <strong>${this.reservationMaster.referenceNumber}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationMaster.statusId = 6;
        this.reservationMaster.modifiedBy = this.commonService.activeUser?.username;
        this.setStatus();
      }
    });
  }

  complete() {
    if (this.outstandingBalance > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Balance Not Settled',
        text: 'Kindly settle the outstanding balance first to complete the reservation.',
      });
      return;
    }

    Swal.fire({
      title: 'Complete Reservation',
      html: `Are you sure you want to complete reservation <strong>${this.reservationMaster.referenceNumber}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Complete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationMaster.statusId = 3;
        this.reservationMaster.modifiedBy = this.commonService.activeUser?.username;
        this.setStatus();
      }
    });
  }

  update() {
    const frmReservation = document.getElementById('frm-reservation-details') as HTMLFormElement;
    frmReservation.classList.add('was-validated');
    if (!frmReservation.checkValidity()) {
      return;
    }
    if ((+this.reservationMaster.statusId === 2 || +this.reservationMaster.statusId === 7) && !this.validateRoomAssignment()) {
      Swal.fire({
        title: 'Unable to Update Reservation',
        html: 'Please assign a room to the selected room/s',
        icon: 'error'
      });
      return;
    }
    this.reservationMaster.modifiedBy = this.commonService?.activeUser?.username;
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.updateDetail(this.reservationMaster)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'Reservation details successfully saved!', 'success');
          this.close();
          this.reservationsDataGrid.load();
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

  checkIn() {
    if (this.outstandingBalance > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Balance Not Settled',
        text: 'Kindly settle the outstanding balance first to complete the reservation.',
      });
      return;
    }
    Swal.fire({
      title: 'Check-In Reservation',
      html: `Are you sure you want to set the status to Check-In of reservation `
        + `<strong>${this.reservationMaster.referenceNumber}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Check-In'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationMaster.statusId = 7;
        this.reservationMaster.modifiedBy = this.commonService.activeUser?.username;
        this.setStatus();
      }
    });
  }

  close() {
    document.getElementById('frm-guest-information').classList.remove('was-validated');
    document.getElementById('frm-reservation-details').classList.remove('was-validated');
    document.getElementById('frm-assigned-room').classList.remove('was-validated');
    this.initReservation = false;
    this.modal.close();
  }

  download(attachmentPath: string) {
    const a = document.createElement('a');
    const filename = attachmentPath.replace(/^.*[\\\/]/, '');
    a.download = filename;
    let fileData: any;
    this.reservationService.downloadAttachment(attachmentPath)
      .pipe(finalize(() => {
        if (fileData) {
          const file = new Blob([fileData]);
          const fileURL = URL.createObjectURL(file);
          a.href = fileURL;
          a.click();
        } else {
          Swal.fire('Unable to download attachment. An error occured.');
        }
      }))
      .subscribe(data => fileData = data,
        error => {
          console.log(error);
        });
  }

  clearCheckOutDate() {
    if (this.reservationMaster) {
      this.reservationMaster.checkOutDate = null;
    }
  }

  // privates

  private getReservationDetail(referenceNo: string) {
    this.assignedRooms = [];
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.getReservationByRefNo(referenceNo)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          if (httpResponse.body) {
            this.reservationMaster = httpResponse.body;
            this.tmpReservationDetails = JSON.stringify(this.reservationMaster);
            this.reservationMaster?.assignedRooms?.forEach(x => {
              const option = {id: x.roomMasterId, name: x.roomName} as BsSelectOption;
              this.assignedRooms.push(option);
            });
            const hideTime = document.getElementById('hide-time') as HTMLLinkElement;
            if (+this.reservationMaster.statusId === 7) {
              if (hideTime) {
                hideTime.disabled = true;
              }
            } else {
              if (hideTime) {
                hideTime.disabled = false;
              }
            }
            this.getAvailableRooms();
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

  private validateRoomAssignment() {
    if (!this.reservationMaster.assignedRooms?.length) {
      return false;
    }
    const familyRooms = this.reservationMaster?.roomReservationDetails?.filter(x => +x.roomTypeId === 1)?.length;
    const regularRooms = this.reservationMaster?.roomReservationDetails?.filter(x => +x.roomTypeId === 2)?.length;
    let selectedFamilyRooms = 0;
    let selectedRegularRooms = 0;
    this.reservationMaster.assignedRooms.forEach(x => {
      const selected = this.availableRooms?.find(y => +y.id === +x.roomMasterId);
      if (selected.group === 'Family Room') {
        selectedFamilyRooms += 1;
      } else {
        selectedRegularRooms += 1;
      }
    });
    if (+familyRooms !== +selectedFamilyRooms || +regularRooms !== +selectedRegularRooms) {
      return false;
    }
    return true;
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

  private setStatus() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.reservationService.setStatus(this.reservationMaster)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'Reservation successfully saved!', 'success');
          this.close();
          this.reservationsDataGrid.load();
        } else {
          Swal.fire('Unable to save reservation status', httpResponse?.message, 'error');
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
    const date = new Date(new Date().toDateString());
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
    if (!this.reservationMaster.checkInDate) {
      return this.min;
    }
    const cid = new Date(this.reservationMaster.checkInDate);
    const date = new Date(cid.toDateString());
    date.setDate(date.getDate() + 1);
    date.setHours(12);
    return date;
  }

  get isDisabledStatus() {
    return +this.reservationMaster.statusId === 3 || +this.reservationMaster.statusId === 4
      || +this.reservationMaster.statusId === 5 || +this.reservationMaster.statusId === 6;
  }

  get totalPayment() {
    if (!this.reservationMaster || !this.reservationMaster.payments || !this.reservationMaster.payments.length) {
      return 0;
    }
    let totalPayment = 0;
    this.reservationMaster.payments.forEach(p => totalPayment = +totalPayment + +p.amount);
    return totalPayment;
  }

  get isNew() {
    return +this.reservationMaster.reservationId ? false : true;
  }

  get hasReservationChanges() {
    if (+this.reservationMaster?.statusId === 2 || +this.reservationMaster.statusId === 7) {
      const tmpSelectedReservation = JSON.parse(JSON.stringify(this.reservationMaster)) as ReservationMaster;
      const objTmpReservationDetails = JSON.parse(this.tmpReservationDetails) as ReservationMaster;
      objTmpReservationDetails?.assignedRooms.map(x => {
        x.reservationDetailId = 0;
        x.roomMasterId = +x.roomMasterId;
        x.roomName = '';
      });
      tmpSelectedReservation?.assignedRooms.map(x => {
        x.reservationDetailId = 0;
        x.roomMasterId = +x.roomMasterId;
        x.roomName = '';
      });
      tmpSelectedReservation.roomReservationDetails?.forEach(x => {
        x.roomTypeId = +x.roomTypeId;
      });
      tmpSelectedReservation.checkInDate = new Date(tmpSelectedReservation.checkInDate);
      tmpSelectedReservation.checkOutDate = new Date(tmpSelectedReservation.checkOutDate);
      objTmpReservationDetails.checkInDate = new Date(objTmpReservationDetails.checkInDate);
      objTmpReservationDetails.checkOutDate = new Date(objTmpReservationDetails.checkOutDate);
      if (JSON.stringify(tmpSelectedReservation) !== JSON.stringify(objTmpReservationDetails)) {
        return true;
      }
    }
    return false;
  }

  get outstandingBalance() {
    if (!+this.reservationMaster?.grandTotal) {
      return 0;
    }
    return +this.reservationMaster.grandTotal - +this.totalPayment;
  }

}

export interface MultiSelectOption {
  id: number;
  name: string;
}
