import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { ReservationsReportComponent } from './pages/internal/reports/reservations-report/reservations-report.component';
import { PaymentsReportComponent } from './pages/internal/reports/payments-report/payments-report.component';
import { ReservationSummaryComponent } from './pages/internal/reports/reservation-summary/reservation-summary.component';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ClientLayoutComponent,
    ReservationsReportComponent,
    PaymentsReportComponent,
    ReservationSummaryComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
