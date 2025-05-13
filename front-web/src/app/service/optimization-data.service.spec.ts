import { TestBed } from '@angular/core/testing';

import { OptimizationDataService } from './optimization-data.service';

describe('OptimizationDataService', () => {
  let service: OptimizationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptimizationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
