import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmailSettings } from '../_interfaces/email-settings';
import { PaymentDetail } from '../_interfaces/payment-detail';
import { RoomDetail } from '../_interfaces/room-detail';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  apiUrl = `${environment.apiUrl}maintenance`;

  constructor(private httpClient: HttpClient) { }

  // get
  public getRoomRates() {
    const url = `${this.apiUrl}/get-room-rates`;
    return this.httpClient.get(url);
  }

  public getRoomRate(roomTypeId: number) {
    const url = `${this.apiUrl}/get-room-rate`;
    return this.httpClient.post(url, { roomTypeId });
  }

  public getPaymentDetail(paymentTypeId: number) {
    const url = `${this.apiUrl}/get-payment-detail`;
    return this.httpClient.post(url, { paymentTypeId });
  }

  public getEmailSettings() {
    const url = `${this.apiUrl}/get-email-settings`;
    return this.httpClient.get(url);
  }

  public getRoomMasters() {
    const url = `${this.apiUrl}/get-room-masters`;
    return this.httpClient.get(url);
  }
  // end get

  // set
  public setRoomRates(roomRate: RoomDetail) {
    const url = `${this.apiUrl}/set-room-rates`;
    return this.httpClient.post(url, roomRate);
  }

  public setPaymentDetail(paymentDetail: PaymentDetail) {
    const url = `${this.apiUrl}/set-payment-detail`;
    return this.httpClient.post(url, paymentDetail);
  }

  public setEmailSettings(emailSettings: EmailSettings) {
    const url = `${this.apiUrl}/set-email-settings`;
    return this.httpClient.post(url, emailSettings);
  }

  public setRoomMaster(roomDetail: RoomDetail) {
    const url = `${this.apiUrl}/set-room-master`;
    return this.httpClient.post(url, roomDetail);
  }
  // end set

}
