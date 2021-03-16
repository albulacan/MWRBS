import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuGroup, RouteInfo } from 'src/app/_interfaces/route-info';
import { CommonService } from 'src/app/_services/common.service';

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'ni ni-chart-bar-32 text-success', class: '', group: MenuGroup.admin },
    { path: 'reservations', title: 'Reservations',  icon: 'ni ni-calendar-grid-58 text-primary', class: '', group: MenuGroup.admin },
    { path: 'room-rates', title: 'Room Rates',  icon: 'ni ni-money-coins text-info', class: '', group: MenuGroup.maintenance },
    { path: 'room-master', title: 'Room Maintenance',  icon: 'fa fa-server text-orange', class: '', group: MenuGroup.maintenance },
    // tslint:disable-next-line: max-line-length
    { path: 'payment-maintenance', title: 'Payment Maintenance',  icon: 'ni ni-credit-card text-yellow', class: '', group: MenuGroup.maintenance },
    { path: 'email-settings', title: 'Email Settings',  icon: 'ni ni-email-83 text-primary', class: '', group: MenuGroup.maintenance },
    { path: 'user-management', title: 'User Management',  icon: 'fa fa-user-plus', class: '', group: MenuGroup.maintenance },
    { path: 'reports', title: 'Reports',  icon: 'ni ni-single-copy-04', class: '', group: MenuGroup.report }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;

  constructor(
    private router: Router,
    public commonService: CommonService
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  get MENU_GROUP() { return MenuGroup; }

}
