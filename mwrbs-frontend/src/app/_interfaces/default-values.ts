export interface DefaultValues {
    paymentTypes: PaymentType[];
    roomTypes: RoomType[];
    userTypes: UserType[];
    roomStatuses: RoomStatus[];
    reservationStatuses: ReservationStatus[];
}

export interface PaymentType {
    paymentTypeId: number;
    paymentTypeName: string;
}

export interface RoomType {
    roomTypeId: number;
    roomTypeName: string;
}

export interface UserType {
    userTypeId: number;
    userTypeName: string;
}

export interface RoomStatus {
    roomStatusId: number;
    roomStatusName: string;
}

export interface ReservationStatus {
    statusId: number;
    statusName: string;
}
