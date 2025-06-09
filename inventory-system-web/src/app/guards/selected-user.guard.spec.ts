import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { selectedUserGuard } from './selected-user.guard';

describe('selectedUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => selectedUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
