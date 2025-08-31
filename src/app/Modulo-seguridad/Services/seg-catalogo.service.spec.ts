import { TestBed } from '@angular/core/testing';

import { SegCatalogoService } from './seg-catalogo.service';

describe('SegCatalogoService', () => {
  let service: SegCatalogoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SegCatalogoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
