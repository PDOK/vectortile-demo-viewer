import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'


import { LocationComponent } from './location.component'
import { provideHttpClient } from '@angular/common/http'

describe('LocationComponent', () => {
  let component: LocationComponent
  let fixture: ComponentFixture<LocationComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationComponent],
      providers: [

        provideHttpClient(),
        provideHttpClientTesting()]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
