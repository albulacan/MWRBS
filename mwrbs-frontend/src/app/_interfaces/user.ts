export interface User {
    userMasterId: number;
    username: string;
    password: string;
    userTypeId: number | string;
    userTypeName: string;
    name: string;
    firstName: string;
    middleName: string;
    lastName: string;
    emailAddress: string;
    contactNumber: string;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    changedPasswordOn: string;
    lockedOut: boolean;
    oldPassword: string;
    confirmPassword: string;
}
