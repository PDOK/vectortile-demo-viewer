import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlmapComponent } from './olmap.component';

describe('OlmapComponent', () => {
  let component: OlmapComponent;
  let fixture: ComponentFixture<OlmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
