import { TestBed } from '@angular/core/testing';

import { ResponsesService } from './responses.service';

describe('ResponsesService', () => {
  let service: ResponsesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
