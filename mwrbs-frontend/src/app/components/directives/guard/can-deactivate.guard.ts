import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

declare var window: any;

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(
    private readonly location: Location,
    private readonly router: Router
  ) { }

  canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot) {
    if (!window.confirm('Are you sure you want to leave this page? Unsaved details will be lost.')) {
      const currentUrlTree = this.router.createUrlTree([], currentRoute);
      const currentUrl = currentUrlTree.toString();
      this.location.go(currentUrl);
      return false;
    }
    return true;
  }
}

async function confirm() {
  await Swal.fire({
    title: 'Leave Page',
    html: `Are you sure you want to leave this page? Unsaved details will be lost.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    } else {
      return false;
    }
  });
}
