export interface PaymentDetail {
    paymentMasterId: string | number;
    reservationId: number;
    paymentTypeId: number;
    paymentTypeName: string;
    accountNumber: string;
    accountName: string;
    attachmentPath: string;
    modifiedBy: string;
    modifiedOn: string;
    createdBy: string;
    createdOn: string;
}
