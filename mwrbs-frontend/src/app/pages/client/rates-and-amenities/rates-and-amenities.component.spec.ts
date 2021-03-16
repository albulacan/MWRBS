import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesAndAmenitiesComponent } from './rates-and-amenities.component';

describe('RatesAndAmenitiesComponent', () => {
  let component: RatesAndAmenitiesComponent;
  let fixture: ComponentFixture<RatesAndAmenitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatesAndAmenitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesAndAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
