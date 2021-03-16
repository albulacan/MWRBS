import { Routes } from '@angular/router';

import { DashboardComponent } from 'src/app/pages/internal/dashboard/dashboard.component';
import { UserProfileComponent } from 'src/app/pages/internal/user-profile/user-profile.component';
import { ReservationsComponent } from 'src/app/pages/internal/reservations/reservations.component';
import { RoomRatesComponent } from 'src/app/pages/internal/maintenance/room-rates/room-rates.component';
import { PaymentComponent } from 'src/app/pages/internal/maintenance/payment/payment.component';
import { EmailSettingsComponent } from 'src/app/pages/internal/maintenance/email-settings/email-settings.component';
import { RoomMasterComponent } from 'src/app/pages/internal/maintenance/room-master/room-master.component';
import { UserManagementComponent } from 'src/app/pages/internal/maintenance/user-management/user-management.component';
import { ReportsComponent } from 'src/app/pages/internal/reports/reports.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'reservations', component: ReservationsComponent },
    { path: 'room-rates', component: RoomRatesComponent },
    { path: 'payment-maintenance', component: PaymentComponent },
    { path: 'email-settings', component: EmailSettingsComponent },
    { path: 'room-master', component: RoomMasterComponent },
    { path: 'user-management', component: UserManagementComponent },
    { path: 'reports', component: ReportsComponent }
];
