import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { ClientLayoutRoutes } from './client-layout.routing.module';
import { HomeComponent } from '../../pages/client/home/home.component';
import { CheckReservationComponent } from '../../pages/client/check-reservation/check-reservation.component';
import { RoomReservationsComponent } from '../../pages/client/room-reservations/room-reservations.component';
import { RatesAndAmenitiesComponent } from '../../pages/client/rates-and-amenities/rates-and-amenities.component';
import { PageNotFoundComponent } from '../../pages/client/page-not-found/page-not-found.component';
import { ContactUsComponent } from '../../pages/client/contact-us/contact-us.component';
import { AboutUsComponent } from '../../pages/client/about-us/about-us.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ClientLayoutRoutes),
    FormsModule,
    ComponentsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [
    HomeComponent,
    RoomReservationsComponent,
    CheckReservationComponent,
    RatesAndAmenitiesComponent,
    PageNotFoundComponent,
    ContactUsComponent,
    AboutUsComponent
  ]
})
export class ClientLayoutModule { }
