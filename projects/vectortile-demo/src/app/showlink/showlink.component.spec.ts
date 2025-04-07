import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowlinkComponent } from './showlink.component';

describe('ShowlinkComponent', () => {
  let component: ShowlinkComponent;
  let fixture: ComponentFixture<ShowlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ ShowlinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowlinkComponent);
    component = fixture.componentInstance;
    // Trigger Angular's change detection to initialize the component's template and bindings
        fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
