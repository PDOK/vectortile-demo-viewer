import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapexportComponent } from './mapexport.component';

describe('MapexportComponent', () => {
  let component: MapexportComponent;
  let fixture: ComponentFixture<MapexportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapexportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapexportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
