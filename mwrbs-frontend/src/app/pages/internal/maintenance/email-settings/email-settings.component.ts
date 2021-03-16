import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { EmailRequest } from 'src/app/_interfaces/email-request';
import { EmailSettings } from 'src/app/_interfaces/email-settings';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { CommonService } from 'src/app/_services/common.service';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.scss']
})
export class EmailSettingsComponent implements OnInit {

  emailSettings = {} as EmailSettings;
  emailRequest = {} as EmailRequest;
  isProcessing = false;

  constructor(private maintenanceService: MaintenanceService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.getEmailSettings();
  }

  getEmailSettings() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.maintenanceService.getEmailSettings()
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          if (httpResponse.body) {
            this.emailSettings = httpResponse.body;
          }
        } else {
          Swal.fire('Unable to get email settings', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  save() {
    const form = document.getElementById('frm-email-settings') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.emailSettings.modifiedBy = this.commonService.activeUser?.username;
    this.maintenanceService.setEmailSettings(this.emailSettings)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'Email settings successfully saved!', 'success');
        } else {
          Swal.fire('Unable to save email settings', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  sendTestEmail() {
    const form = document.getElementById('frm-test-email') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.emailRequest.subject = 'Test Email';
    this.emailRequest.body = 'Hi, good day! This is a test email!';
    this.commonService.sendEmail(this.emailRequest)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'Test email successfully sent!', 'success');
        } else {
          Swal.fire('Unable to send test email', httpResponse?.message, 'error');
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
