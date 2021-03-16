import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuGroup, RouteInfo } from 'src/app/_interfaces/route-info';

export const ROUTES: RouteInfo[] = [
  { path: '/rates-and-amenities', title: 'Rates & Amenities',  icon: 'ni ni-money-coins text-dark', class: '', group: MenuGroup.client },
  { path: '/reservations', title: 'Reserve Now',  icon: 'ni ni-calendar-grid-58 text-dark', class: '', group: MenuGroup.client },
  { path: '/check-status', title: 'Check Your Reservation',  icon: 'fa fa-search text-dark', class: '', group: MenuGroup.client },
  { path: '/about-us', title: 'About Us',  icon: 'ni ni-credit-card text-dark', class: '', group: MenuGroup.client },
  { path: '/contact-us', title: 'Contact Us',  icon: 'fa fa-phone text-dark', class: '', group: MenuGroup.client },
];


@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.scss']
})
export class ClientNavbarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  onScroll = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    if (window.scrollY) {
      this.onScroll = true;

      return;
    }
    this.onScroll = false;
  }

  get MENU_GROUP() { return MenuGroup; }
}
