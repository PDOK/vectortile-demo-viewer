import { TestBed } from '@angular/core/testing';

import { IdlookupService } from './idlookup.service';

describe('IdlookupService', () => {
  let service: IdlookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdlookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
