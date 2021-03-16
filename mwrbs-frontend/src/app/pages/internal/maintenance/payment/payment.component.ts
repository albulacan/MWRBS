import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { PaymentDetail } from 'src/app/_interfaces/payment-detail';
import { CommonService } from 'src/app/_services/common.service';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentDetail = {} as PaymentDetail;
  isProcessing = false;

  constructor(public commonService: CommonService, private maintenanceService: MaintenanceService) {
  }

  ngOnInit(): void {
  }

  save() {
    const form = document.getElementById('frm-payment-maintenance') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.paymentDetail.modifiedBy = this.commonService.activeUser?.username;
    this.paymentDetail.createdBy = this.commonService.activeUser?.username;
    this.maintenanceService.setPaymentDetail(this.paymentDetail)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'Payment detail successfully saved!', 'success');
        } else {
          Swal.fire('Unable to save payment detail', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  onPaymentTypeChange() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.maintenanceService.getPaymentDetail(this.paymentDetail.paymentTypeId)
      .pipe(finalize(() => {
        document.getElementById('frm-payment-maintenance').classList.remove('was-validated');
        if (httpResponse?.success) {
          if (httpResponse.body) {
            this.paymentDetail = httpResponse.body;
          } else {
            this.paymentDetail.paymentMasterId = 0;
            this.paymentDetail.accountName = '';
            this.paymentDetail.accountNumber = '';
            this.paymentDetail.modifiedBy = '';
            this.paymentDetail.modifiedOn = '';
          }
        } else {
          Swal.fire('Unable to get payment details', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

}
