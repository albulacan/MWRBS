import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService } from 'src/app/components/directives/attribute/bs-modal.service';
import { DataGridServerService } from 'src/app/components/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/components/directives/attribute/data-grid.factory';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { RoomDetail } from 'src/app/_interfaces/room-detail';
import { CommonService } from 'src/app/_services/common.service';
import { MaintenanceService } from 'src/app/_services/maintenance.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-room-master',
  templateUrl: './room-master.component.html',
  styleUrls: ['./room-master.component.scss']
})
export class RoomMasterComponent implements OnInit {

  filter = {
    roomStatusId: 0,
    roomTypeId: 0
  } as RoomDetail;
  roomMasterDataGrid: DataGridServerService<RoomDetail>;

  modal: BsModalService;
  selectedRoomDetail = {
    roomStatusId: '',
    roomTypeId: ''
  } as RoomDetail;
  isProcessing = false;

  constructor(private dgFactory: DataGridFactory, public commonService: CommonService, private maintenanceService: MaintenanceService) { }

  ngOnInit(): void {
    const url = `${environment.apiUrl}maintenance/get-dg-room-master`;
    this.roomMasterDataGrid = this.dgFactory.post({url}, this.filter);
  }

  view(detail: RoomDetail) {
    this.selectedRoomDetail = JSON.parse(JSON.stringify(detail));
    this.modal.open();
  }

  add() {
    this.selectedRoomDetail.roomMasterId = 0;
    this.selectedRoomDetail.roomName = '';
    this.selectedRoomDetail.roomStatusId = '';
    this.modal.open();
  }

  save() {
    const form = document.getElementById('frm-room-master') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    this.isProcessing = true;
    this.selectedRoomDetail.modifiedBy = this.commonService.activeUser?.username;
    let httpResponse: IHttpResponse;
    this.maintenanceService.setRoomMaster(this.selectedRoomDetail)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'Room details successfully saved!', 'success');
          this.close();
          this.roomMasterDataGrid.load(true);
        } else {
          Swal.fire('Unable to save room master', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  close() {
    document.getElementById('frm-room-master').classList.remove('was-validated');
    this.modal.close();
  }

}
