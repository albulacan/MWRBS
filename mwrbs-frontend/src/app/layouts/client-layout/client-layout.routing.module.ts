import { Routes } from '@angular/router';

import { HomeComponent } from '../../pages/client/home/home.component';
import { RoomReservationsComponent } from '../../pages/client/room-reservations/room-reservations.component';
import { CheckReservationComponent } from '../../pages/client/check-reservation/check-reservation.component';
import { RatesAndAmenitiesComponent } from '../../pages/client/rates-and-amenities/rates-and-amenities.component';
import { ContactUsComponent } from '../../pages/client/contact-us/contact-us.component';
import { AboutUsComponent } from '../../pages/client/about-us/about-us.component';
import { CanDeactivateGuard } from 'src/app/components/directives/guard/can-deactivate.guard';

export const ClientLayoutRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'reservations', component: RoomReservationsComponent },
    { path: 'check-status', component: CheckReservationComponent, canDeactivate: [ CanDeactivateGuard ] },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'rates-and-amenities', component: RatesAndAmenitiesComponent },
];
