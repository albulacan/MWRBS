import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsReportComponent } from './reservations-report.component';

describe('ReservationsReportComponent', () => {
  let component: ReservationsReportComponent;
  let fixture: ComponentFixture<ReservationsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
