import { TestBed } from '@angular/core/testing';

import { SclwService } from './sclw.service';

describe('SclwService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SclwService = TestBed.get(SclwService);
    expect(service).toBeTruthy();
  });
});
