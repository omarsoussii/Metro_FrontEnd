import { TestBed } from '@angular/core/testing';

import { CustomDateTimeProviderService } from './custom-date-time-provider.service';

describe('CustomDateTimeProviderService', () => {
  let service: CustomDateTimeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomDateTimeProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
