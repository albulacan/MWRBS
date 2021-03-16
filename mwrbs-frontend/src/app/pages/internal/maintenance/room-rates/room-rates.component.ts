import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { RoomDetail } from 'src/app/_interfaces/room-detail';
import { CommonService } from 'src/app/_services/common.service';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room-rates',
  templateUrl: './room-rates.component.html',
  styleUrls: ['./room-rates.component.scss']
})
export class RoomRatesComponent implements OnInit {

  roomRate = {} as RoomDetail;
  isProcessing = false;

  constructor(public commonService: CommonService, private maintenanceService: MaintenanceService) {
  }

  ngOnInit(): void {
  }

  save() {
    const form = document.getElementById('frm-room-rates') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.roomRate.modifiedBy = this.commonService.activeUser?.username;
    this.maintenanceService.setRoomRates(this.roomRate)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'Room rates successfully saved!', 'success');
        } else {
          Swal.fire('Unable to save room rates', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  onRoomTypeChange() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.maintenanceService.getRoomRate(+this.roomRate.roomTypeId)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          document.getElementById('frm-room-rates').classList.remove('was-validated');
          if (httpResponse.body) {
            this.roomRate = httpResponse.body;
          }
        } else {
          Swal.fire('Unable to get room rates', httpResponse?.message, 'error');
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
