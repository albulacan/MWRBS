export interface ReservationPayment {
    reservationPaymentId: number;
    paymentTypeId: number | string;
    paymentTypeName: string;
    reservationId: number;
    referenceNumber: string;
    accountNumber: string;
    accountName: string;
    amount: number | string;
    file: string;
    attachmentPath: string;
    createdOn: Date;
    dateFrom: Date;
    dateTo: Date;
}
