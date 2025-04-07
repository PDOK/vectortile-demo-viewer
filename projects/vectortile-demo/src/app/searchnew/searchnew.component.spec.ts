import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchnewComponent } from './searchnew.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchnewComponent', () => {
  let component: SearchnewComponent;
  let fixture: ComponentFixture<SearchnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchnewComponent],

    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
