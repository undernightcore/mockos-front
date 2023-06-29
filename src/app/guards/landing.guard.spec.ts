import { TestBed } from '@angular/core/testing';

import { LandingGuard } from './landing.guard';

describe('LandingGuard', () => {
  let guard: LandingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LandingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
