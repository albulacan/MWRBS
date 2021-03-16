export interface RoomDetail {
    roomMasterId: number;
    roomName: string;
    roomTypeId: number | string;
    roomTypeName: string;
    roomStatusId: number | string;
    roomStatusName: string;
    rate: number;
    rateEffectivity: number;
    additionalRatePerHour: number;
    capacity: number;
    additionalGuestCapacity: number;
    additionalGuestRate: number;
    mattressRate: number;
    description: string;
    modifiedBy: string;
    modifiedOn: string;
    createdBy: string;
    createdOn: string;
}
