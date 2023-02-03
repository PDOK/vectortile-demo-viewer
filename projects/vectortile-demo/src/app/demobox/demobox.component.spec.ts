import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoboxComponent } from './demobox.component';

describe('DemoboxComponent', () => {
  let component: DemoboxComponent;
  let fixture: ComponentFixture<DemoboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
