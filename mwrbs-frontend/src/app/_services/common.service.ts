import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DefaultValues } from '../_interfaces/default-values';
import { EmailRequest } from '../_interfaces/email-request';
import { IHttpResponse } from '../_interfaces/http-response';
import { User } from '../_interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  apiUrl = `${environment.apiUrl}common`;
  defaultValues = {} as DefaultValues;

  constructor(private httpClient: HttpClient) {
    this.getDefaultValues();
  }

  getDefaultValues() {
    const url = `${this.apiUrl}/get-default-values`;
    let httpResponse: IHttpResponse;
    this.httpClient.get(url)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          this.defaultValues = httpResponse.body;
        } else {
          console.log(`Unable to get default values. ${httpResponse.message}`);
        }
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          console.log(error);
      });
  }

  sendEmail(request: EmailRequest) {
    const url = `${this.apiUrl}/send-email`;
    return this.httpClient.post(url, request);
  }

  toTwoDecimal(val: number) {
    if (!val) {
      return 0;
    }
    return Math.round(val * 100) / 100;
  }

  // getters

  get activeUser() {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user')) as User;
    }
  }

  get userFullName() {
    if (!this.activeUser) {
      return '';
    }
    if (this.activeUser?.username?.toLowerCase() === 'admin') {
      return 'Admin';
    }
    return `${this.activeUser.firstName} ${this.activeUser.middleName} ${this.activeUser.lastName}`;
  }
}
