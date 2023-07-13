import { TestBed } from '@angular/core/testing';

import { HeadersService } from './headers.service';

describe('HeadersService', () => {
  let service: HeadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
