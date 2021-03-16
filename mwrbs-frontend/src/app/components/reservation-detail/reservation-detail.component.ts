import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { ReservationMaster, RoomReservationDetail } from 'src/app/_interfaces/reservation-master';
import { RoomDetail } from 'src/app/_interfaces/room-detail';
import { CommonService } from 'src/app/_services/common.service';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
})
export class ReservationDetailComponent implements OnInit {

  @Output() ngRoomChange = new EventEmitter<any>();
  @Input() disabled: boolean;
  @Input() reservationMaster: ReservationMaster;
  @Input() availableRooms: RoomDetail[];
  @Input() isInternal: boolean;

  isProcessing = false;
  familyRoom = {} as RoomDetail;
  standardRoom = {} as RoomDetail;
  isCapacityExceeded = false;

  constructor(public commonService: CommonService, private maintenanceService: MaintenanceService) { }

  ngOnInit(): void {
    this.getRoomRates();
  }

  plus(type: string, i: number = 0) {
    if (type === 'room') {
      this.reservationMaster.roomCount += 1;
      const roomDetail = new RoomReservationDetail();
      const selectedStandardRoom = this.getSelectedRoomTypeCount(2);
      if ((+this.getAvailableRoomCount(2) - +selectedStandardRoom) <= 0) {
        roomDetail.roomTypeId = 1;
      }
      this.reservationMaster.roomReservationDetails.push(roomDetail);
      i = +this.reservationMaster.roomCount - 1;
      this.ngRoomChange.emit();
    } else if (type === 'guest') {
      this.reservationMaster.roomReservationDetails[i].noOfGuest += 1;
    } else if (type === 'mattress') {
      this.reservationMaster.roomReservationDetails[i].additionalMattress += 1;
    }
    this.calculateReservation(i);
  }

  minus(type: string, i: number = 0) {
    let isGuestMinus = false;
    if (type === 'room') {
      this.reservationMaster.roomCount -= 1;
      this.reservationMaster.roomReservationDetails.pop();
      i = +this.reservationMaster.roomCount - 1;
      this.ngRoomChange.emit();
    } else if (type === 'guest') {
      this.reservationMaster.roomReservationDetails[i].noOfGuest -= 1;
      isGuestMinus = true;
    } else if (type === 'mattress') {
      this.reservationMaster.roomReservationDetails[i].additionalMattress -= 1;
    }
    this.calculateReservation(i, isGuestMinus);
  }

  isDisabledGuestPlus(i: number) {
    if (!this.reservationMaster?.roomReservationDetails[i]) {
      return true;
    }
    let roomRates = this.standardRoom;
    if (+this.reservationMaster?.roomReservationDetails[i].roomTypeId === 1) {
      roomRates = this.familyRoom;
    }
    const cap = +roomRates.capacity + +roomRates.additionalGuestCapacity;
    if (this.reservationMaster?.roomReservationDetails[i].noOfGuest === cap) {
      return true;
    }
    return false;
  }

  isDisabledMattressMinus(i: number) {
    if (!this.reservationMaster?.roomReservationDetails[i]) {
      return true;
    }
    let base = 0;
    if (+this.reservationMaster?.roomReservationDetails[i].additionalGuest) {
      base = 1;
    }
    if (+this.reservationMaster?.roomReservationDetails[i].additionalMattress === base) {
      return true;
    }
    return false;
  }

  isDisabledMattressPlus(i: number) {
    if (this.isInternal && +this.reservationMaster?.statusId === 7) {
      return false;
    }
    if (!this.reservationMaster?.roomReservationDetails[i] || !+this.reservationMaster?.roomReservationDetails[i]?.additionalGuest) {
      return true;
    }
    let cap = 99;
    if (+this.reservationMaster?.roomReservationDetails[i].additionalGuest) {
      cap = +this.reservationMaster?.roomReservationDetails[i].additionalGuest;
    }
    if (+this.reservationMaster?.roomReservationDetails[i].additionalMattress === cap) {
      return true;
    }
    return false;
  }

  calculateAllReservation(resetSelectedRooms: boolean = false) {
    if (resetSelectedRooms) {
      this.reservationMaster.roomReservationDetails = new Array<RoomReservationDetail>(new RoomReservationDetail());
      this.reservationMaster.roomCount = 1;
    }
    this.reservationMaster?.roomReservationDetails?.forEach((x, i) => {
      this.calculateReservation(i);
    });
  }

  calculateReservation(i: number, isGuestMinus: boolean = false) {
    if (!this.familyRoom || !this.standardRoom || !this.reservationMaster?.roomReservationDetails?.length) {
      return;
    }

    const reservationDetail = this.reservationMaster?.roomReservationDetails[i];

    if (!this.reservationMaster?.checkInDate || !this.reservationMaster?.checkOutDate || !reservationDetail) {
      this.reservationMaster.grandTotal = 0;
      return;
    }

    let roomRates = this.standardRoom;
    if (+reservationDetail.roomTypeId === 1) {
      roomRates = this.familyRoom;
    }

    if (+reservationDetail.noOfGuest > +roomRates.capacity) {
      reservationDetail.additionalGuest = +reservationDetail.noOfGuest - +roomRates.capacity;
      this.isCapacityExceeded = true;
      if (!+reservationDetail.additionalMattress) {
        this.reservationMaster.roomReservationDetails[i].additionalMattress = 1;
      } else {
        if (isGuestMinus && +this.reservationMaster.roomReservationDetails[i].additionalMattress > +reservationDetail.additionalGuest) {
          this.reservationMaster.roomReservationDetails[i].additionalMattress -= 1;
        }
      }
    } else {
      if (isGuestMinus) {
        this.reservationMaster.roomReservationDetails[i].additionalMattress = 0;
      }
      reservationDetail.additionalGuest = 0;
      let exceeded = false;
      this.reservationMaster.roomReservationDetails.forEach(x => {
        if (exceeded) {
          return;
        }
        let rate = this.standardRoom;
        if (+x.roomTypeId === 1) {
          rate = this.familyRoom;
        }
        if (+x.noOfGuest > +rate.capacity) {
          exceeded = true;
        }
      });
      this.isCapacityExceeded = exceeded;
    }

    const cid = new Date(this.reservationMaster?.checkInDate).getTime();
    const cod = new Date(this.reservationMaster?.checkOutDate).getTime();
    const bookingHours = Math.abs(cod - cid) / 3600000;
    const rateMultiplier = Math.floor(bookingHours / +roomRates.rateEffectivity);
    const additionalHours = Math.round(bookingHours % +roomRates.rateEffectivity);

    this.reservationMaster.roomReservationDetails[i].totalAmountDue = this.toTwoDecimal((+roomRates.rate * rateMultiplier)
      + (+additionalHours * +roomRates.additionalRatePerHour)
      + (+reservationDetail.additionalGuest * +roomRates.additionalGuestRate)
      + (+reservationDetail.additionalMattress * +roomRates.mattressRate));

    let total = 0;
    this.reservationMaster?.roomReservationDetails?.forEach(x => total += +x.totalAmountDue);
    this.reservationMaster.grandTotal = total;
    this.reservationMaster.roomReservationDetails[i].additionalGuest = reservationDetail.additionalGuest;
  }

  getAvailableRoomCount(roomTypeId: number) {
    if (!this.availableRooms?.length) {
      return 0;
    }
    let count = 0;
    this.availableRooms?.forEach(x => {
      if (+x.roomTypeId === +roomTypeId) {
        count += 1;
      }
    });
    return count;
  }

  getSelectedRoomTypeCount(roomTypeId: number) {
    let count = 0;
    this.reservationMaster?.roomReservationDetails?.forEach(x => {
      if (+x.roomTypeId === +roomTypeId) {
        count += 1;
      }
    });
    return count;
  }

  // privates

  private getRoomRates() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.maintenanceService.getRoomRates()
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const roomRates = httpResponse.body as RoomDetail[];
          if (roomRates?.length) {
            this.familyRoom = roomRates.find(x => +x.roomTypeId === 1);
            this.standardRoom = roomRates.find(x => +x.roomTypeId === 2);
            if (!this.reservationMaster.reservationId) {
              this.calculateReservation(0);
            }
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

  private toTwoDecimal(val: number) {
    if (!val) {
      return 0;
    }
    return Math.round(val * 100) / 100;
  }

  // getters

  get totalGuests() {
    if (!this.reservationMaster?.roomReservationDetails?.length) {
      return 0;
    }
    let total = 0;
    this.reservationMaster.roomReservationDetails.forEach(x => total += +x.noOfGuest);
    return total;
  }

  get totalAdditionalMattress() {
    if (!this.reservationMaster?.roomReservationDetails?.length) {
      return 0;
    }
    let total = 0;
    this.reservationMaster.roomReservationDetails.forEach(x => total += +x.additionalMattress);
    return total;
  }

  get isDisabledPlusRoom() {
    if (this.reservationMaster?.checkInDate && this.reservationMaster?.checkOutDate && !this.availableRooms?.length) {
      return true;
    }
    const selectedFamilyRoom = this.getSelectedRoomTypeCount(1);
    const selectedStandardRoom = this.getSelectedRoomTypeCount(2);
    const availableFamilyRooms = this.getAvailableRoomCount(1);
    const availableStandardRooms = this.getAvailableRoomCount(2);
    const remainingFamilyRooms = +availableFamilyRooms - +selectedFamilyRoom;
    const remainingStandardRooms = +availableStandardRooms - +selectedStandardRoom;
    if (+selectedFamilyRoom && +selectedStandardRoom) {
      if (remainingFamilyRooms <= 0 && remainingStandardRooms <= 0) {
        return true;
      }
    }
    if (+selectedFamilyRoom && remainingFamilyRooms < 0) {
      return true;
    }
    if (+selectedStandardRoom && remainingStandardRooms < 0) {
      return true;
    }
    return false;
  }

}
