import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminLayoutRoutes } from './admin-layout.routing.module';
import { DashboardComponent } from '../../pages/internal/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/internal/user-profile/user-profile.component';
import { ReservationsComponent } from '../../pages/internal/reservations/reservations.component';
import { RoomRatesComponent } from 'src/app/pages/internal/maintenance/room-rates/room-rates.component';
import { PaymentComponent } from 'src/app/pages/internal/maintenance/payment/payment.component';
import { EmailSettingsComponent } from 'src/app/pages/internal/maintenance/email-settings/email-settings.component';
import { RoomMasterComponent } from 'src/app/pages/internal/maintenance/room-master/room-master.component';
import { UserManagementComponent } from 'src/app/pages/internal/maintenance/user-management/user-management.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReportsComponent } from 'src/app/pages/internal/reports/reports.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ComponentsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    ReservationsComponent,
    RoomRatesComponent,
    PaymentComponent,
    EmailSettingsComponent,
    RoomMasterComponent,
    UserManagementComponent,
    ReportsComponent
  ]
})
export class AdminLayoutModule {}
