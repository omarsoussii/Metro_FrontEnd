import { TestBed } from '@angular/core/testing';

import { CustomOauthLoggerService } from './custom-oauth-logger..service';

describe('CustomOauthLoggerService', () => {
  let service: CustomOauthLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomOauthLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
