import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ROUTES } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common.service';
import { BsModalService } from '../directives/attribute/bs-modal.service';
import { User } from 'src/app/_interfaces/user';
import { AuthService } from 'src/app/_services/auth.service';
import Swal from 'sweetalert2';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus: any;
  public menuList: any[];
  public location: Location;

  modal: BsModalService;
  isProcessing = false;
  user = {} as User;

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

  constructor(location: Location, private router: Router, public commonService: CommonService, private authService: AuthService) {
    this.location = location;
  }

  ngOnInit() {
    this.menuList = ROUTES.filter(listTitle => listTitle);
  }

  getTitle() {
    const menuName = this.location.prepareExternalUrl(this.location.path());

    for (let item = 0; item < this.menuList.length; item++) {
      if (`#/internal/${this.menuList[item].path}` === menuName) {
        return this.menuList[item].title;
      }
    }
    return 'User Profile';
  }

  getIcon() {
    const menuName = this.location.prepareExternalUrl(this.location.path());

    for (let item = 0; item < this.menuList.length; item++) {
      if (`/internal/${this.menuList[item].path}` === menuName) {
        return this.menuList[item].icon;
      }
    }
    return 'User Profile';
  }

  logout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/internal/login']);
  }

  openModal() {
    this.user.oldPassword = '';
    this.user.password = '';
    this.user.confirmPassword = '';
    this.modal.open();
  }

  changePassword() {
    const form = document.getElementById('frm-change-password') as HTMLFormElement;
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      return;
    }
    if (this.user.password !== this.user.confirmPassword) {
      this.Toast.fire({
        icon: 'error',
        title: 'Passwords does not match!'
      });
      return;
    }
    this.user.userMasterId = this.commonService.activeUser?.userMasterId;
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.authService.changePassword(this.user)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          Swal.fire('Success', 'Password successfully changed!', 'success');
          this.close();
        } else {
          Swal.fire('Unable to change password', httpResponse?.message, 'error');
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
    document.getElementById('frm-change-password').classList.remove('was-validated');
    this.modal.close();
  }

}
