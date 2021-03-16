import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { ReservationsReportComponent } from './pages/internal/reports/reservations-report/reservations-report.component';
import { PaymentsReportComponent } from './pages/internal/reports/payments-report/payments-report.component';
import { ReservationSummaryComponent } from './pages/internal/reports/reservation-summary/reservation-summary.component';
import { PageNotFoundComponent } from './pages/client/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/client-layout/client-layout.module').then(m => m.ClientLayoutModule)
      }
    ]
  },
  {
    path: 'internal',
    children: [
      {
        path: '',
        component: AdminLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
          }
        ]
      },
      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
          }
        ]
      },
    ]
  },
  {
    path: 'internal/reports/reservations/:dateFrom/:dateTo',
    component: ReservationsReportComponent
  },
  {
    path: 'internal/reports/payments/:dateFrom/:dateTo',
    component: PaymentsReportComponent
  },
  {
    path: 'internal/reports/summary/:referenceNo',
    component: ReservationSummaryComponent
  },
  { path: 'page-not-found', component: PageNotFoundComponent},
  {
    path: '**',
    redirectTo: 'page-not-found'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })
  ],
  exports: [],
})
export class AppRoutingModule { }
