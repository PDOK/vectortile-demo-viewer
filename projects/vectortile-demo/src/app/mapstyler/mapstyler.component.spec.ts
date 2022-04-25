import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapstylerComponent } from './mapstyler.component';

describe('MapstylerComponent', () => {
  let component: MapstylerComponent;
  let fixture: ComponentFixture<MapstylerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapstylerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapstylerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
