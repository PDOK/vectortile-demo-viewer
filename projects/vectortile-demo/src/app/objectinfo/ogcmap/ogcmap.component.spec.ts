import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgcmapComponent } from './ogcmap.component';

describe('OgcmapComponent', () => {
  let component: OgcmapComponent;
  let fixture: ComponentFixture<OgcmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OgcmapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OgcmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
