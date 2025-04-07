import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectinfoComponent } from './objectinfo.component';

describe('ObjectinfoComponent', () => {
  let component: ObjectinfoComponent;
  let fixture: ComponentFixture<ObjectinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ObjectinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
