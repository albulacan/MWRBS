import { ReservationPayment } from './reservation-payment';

export class ReservationMaster {
    reservationId = 0;
    referenceNumber = '';
    roomCount = 1;
    checkInDate: Date;
    checkOutDate: Date;
    roomReservationDetails = new Array<RoomReservationDetail>(new RoomReservationDetail());
    firstName = '';
    lastName = '';
    contactNumber = '';
    emailAddress = '';
    payments = new Array<ReservationPayment>();
    assignedRooms = new Array<RoomAssignment>();
    grandTotal = 0;
    statusId = 0;
    statusName = '';
    createdOn: Date;
    modifiedBy = '';
    modifiedOn = '';
    dateFrom: Date;
    dateTo: Date;
}

export class RoomReservationDetail {
    reservationDetailId = 0;
    roomTypeId = 2;
    roomTypeName = '';
    noOfGuest = 1;
    additionalGuest = 0;
    additionalMattress = 0;
    totalAmountDue: number | string = 0;
}

export class RoomAssignment {
    reservationDetailId = 0;
    roomMasterId = 0;
    roomName = '';
}
