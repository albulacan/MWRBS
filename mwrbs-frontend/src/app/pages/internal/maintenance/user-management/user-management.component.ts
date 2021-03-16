import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService } from 'src/app/components/directives/attribute/bs-modal.service';
import { DataGridServerService } from 'src/app/components/directives/attribute/data-grid-server.service';
import { DataGridFactory } from 'src/app/components/directives/attribute/data-grid.factory';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { User } from 'src/app/_interfaces/user';
import { CommonService } from 'src/app/_services/common.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  filter = {
    name: '',
    userTypeId: 0
  } as User;
  usersDataGrid: DataGridServerService<User>;

  modal: BsModalService;
  selectedUser = {
    userTypeId: 0
  } as User;
  isProcessing = false;

  unlockAccount = false;

  constructor(private dgFactory: DataGridFactory, public commonService: CommonService, private userService: UserService) { }

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  ngOnInit(): void {
    const url = `${environment.apiUrl}user/get-dg-user-details`;
    this.usersDataGrid = this.dgFactory.post({url}, this.filter);
  }

  view(user: User) {
    this.selectedUser = JSON.parse(JSON.stringify(user));
    this.unlockAccount = this.selectedUser.lockedOut;
    this.modal.open();
  }

  add() {
    this.selectedUser.userMasterId = 0;
    this.selectedUser.username = '';
    this.selectedUser.password = '';
    this.selectedUser.oldPassword = '';
    this.selectedUser.userTypeId = '';
    this.selectedUser.firstName = '';
    this.selectedUser.middleName = '';
    this.selectedUser.lastName = '';
    this.selectedUser.emailAddress = '';
    this.selectedUser.contactNumber = '';
    this.selectedUser.modifiedBy = '';
    this.modal.open();
  }

  save() {
    const form = document.getElementById('frm-user-management') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    if (+this.selectedUser.userMasterId) {
      this.selectedUser.modifiedBy = this.commonService.activeUser?.username;
      this.update();
    } else {
      if (this.selectedUser.password !== this.selectedUser.confirmPassword) {
        this.Toast.fire({
          icon: 'error',
          title: 'Passwords does not match!'
        });
        return;
      }
      this.selectedUser.createdBy = this.commonService.activeUser?.username;
      this.enroll();
    }
  }

  enroll() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.userService.enrollUser(this.selectedUser)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'User successfully enrolled!', 'success');
          this.close();
          this.usersDataGrid.load(true);
        } else {
          Swal.fire('Unable to enroll user', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  update() {
    if (this.unlockAccount && this.selectedUser.lockedOut) {
      this.selectedUser.lockedOut = false;
    }
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.userService.updateUser(this.selectedUser)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'User details successfully saved!', 'success');
          this.close();
          this.usersDataGrid.load(true);
        } else {
          Swal.fire('Unable to update user', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  delete(userMasterId: number, username: string) {
    Swal.fire({
      title: 'Delete User',
      html: `Are you sure you want to delete user <strong>${username}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isProcessing = true;
        let httpResponse: IHttpResponse;
        this.userService.delete(userMasterId)
          .pipe(finalize(() => {
            if (httpResponse?.success) {
              Swal.fire('Success', 'User successfully deleted!', 'success');
              this.usersDataGrid.load(true);
            } else {
              Swal.fire('Unable to delete user', httpResponse?.message, 'error');
            }
            this.isProcessing = false;
          }))
          .subscribe((response: IHttpResponse) => httpResponse = response,
            error => {
              this.isProcessing = false;
              console.log(error);
            });
      }
    });
  }

  close() {
    document.getElementById('frm-user-management').classList.remove('was-validated');
    this.modal.close();
  }

}
