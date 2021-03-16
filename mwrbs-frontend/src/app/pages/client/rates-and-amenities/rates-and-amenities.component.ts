import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { RoomDetail } from 'src/app/_interfaces/room-detail';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rates-and-amenities',
  templateUrl: './rates-and-amenities.component.html',
  styleUrls: ['./rates-and-amenities.component.scss']
})
export class RatesAndAmenitiesComponent implements OnInit {

  isProcessing = false;
  familyRoom = {} as RoomDetail;
  standardRoom = {} as RoomDetail;

  constructor(private maintenanceService: MaintenanceService) { }

  ngOnInit(): void {
    this.getRoomRates();
  }

  private getRoomRates() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.maintenanceService.getRoomRates()
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const roomRates = httpResponse.body as RoomDetail[];
          if (roomRates?.length) {
            this.familyRoom = roomRates.find(x => +x.roomTypeId === 1);
            this.standardRoom = roomRates.find(x => +x.roomTypeId === 2);
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
