import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReservationMaster } from '../_interfaces/reservation-master';
import { ReservationPayment } from '../_interfaces/reservation-payment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  apiUrl = `${environment.apiUrl}reservation`;

  constructor(private httpClient: HttpClient) { }

  // get
  public getPayments(reservationId: number) {
    const url = `${this.apiUrl}/get-payments`;
    return this.httpClient.post(url, { reservationId });
  }

  public downloadAttachment(attachmentPath: string) {
    const url = `${this.apiUrl}/download-attachment`;
    return this.httpClient.post(url, { attachmentPath }, { responseType: 'arraybuffer' });
  }

  public getReservationByRefNo(referenceNumber: string) {
    const url = `${this.apiUrl}/get-reservation-by-reference-no`;
    return this.httpClient.post(url, { referenceNumber });
  }

  public getReservations() {
    const url = `${this.apiUrl}/get-reservations`;
    return this.httpClient.get(url);
  }

  public getReservationPayments() {
    const url = `${this.apiUrl}/get-reservation-payments`;
    return this.httpClient.get(url);
  }

  public getAvailableRooms(detail: ReservationMaster) {
    const url = `${this.apiUrl}/get-available-rooms`;
    return this.httpClient.post(url, detail);
  }

  // set
  public setStatus(detail: ReservationMaster) {
    const url = `${this.apiUrl}/set-status`;
    return this.httpClient.post(url, detail);
  }

  public updateDetail(detail: ReservationMaster) {
    const url = `${this.apiUrl}/update-detail`;
    return this.httpClient.post(url, detail);
  }

  public addReservation(detail: ReservationMaster) {
    const url = `${this.apiUrl}/add`;
    return this.httpClient.post(url, detail);
  }

  public addPayment(payments: ReservationPayment[]) {
    const url = `${this.apiUrl}/set-payment`;
    return this.httpClient.post(url, payments);
  }

}
