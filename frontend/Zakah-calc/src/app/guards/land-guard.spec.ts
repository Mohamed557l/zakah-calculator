import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { landGuard } from './land-guard';

describe('landGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => landGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
