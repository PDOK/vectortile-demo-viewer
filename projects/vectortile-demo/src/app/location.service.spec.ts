import { TestBed } from '@angular/core/testing'

import { LocationService } from './location.service'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

describe('LocationService', () => {
  let service: LocationService | undefined = undefined

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [

        provideHttpClient(),
        provideHttpClientTesting()]
    })
    service = TestBed.inject(LocationService)
  })


  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
