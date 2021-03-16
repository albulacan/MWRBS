import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BlockUiDirective } from './directives/attribute/block-ui.directive';
import { PaginationComponent } from './directives/element/pagination/pagination.component';
import { BsModalDirective } from './directives/attribute/bs-modal.directive';
import { NumberDirective } from './directives/attribute/number.directive';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { MoneyDirective } from './directives/attribute/money.directive';
import { FormsModule } from '@angular/forms';
import { ClientFooterComponent } from './client-footer/client-footer.component';
import { ReservationDetailComponent } from './reservation-detail/reservation-detail.component';
import { BsSelectComponent } from './directives/element/bs-select/bs-select.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    BlockUiDirective,
    PaginationComponent,
    BsModalDirective,
    NumberDirective,
    ClientNavbarComponent,
    MoneyDirective,
    ClientFooterComponent,
    ReservationDetailComponent,
    BsSelectComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    BlockUiDirective,
    BsModalDirective,
    PaginationComponent,
    NumberDirective,
    ClientNavbarComponent,
    MoneyDirective,
    ClientFooterComponent,
    ReservationDetailComponent,
    BsSelectComponent
  ]
})
export class ComponentsModule { }
