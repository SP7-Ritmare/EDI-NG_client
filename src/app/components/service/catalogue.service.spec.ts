import { TestBed, inject } from '@angular/core/testing';

import { CatalogueService } from './catalogue.service';

describe('CatalogueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogueService]
    });
  });

  it('should ...', inject([CatalogueService], (service: CatalogueService) => {
    expect(service).toBeTruthy();
  }));
});
