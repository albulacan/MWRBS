import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomReservationsComponent } from './room-reservations.component';

describe('RoomReservationsComponent', () => {
  let component: RoomReservationsComponent;
  let fixture: ComponentFixture<RoomReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomReservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
