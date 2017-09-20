import { TestBed, inject } from '@angular/core/testing';

import { ListFormService } from './list-form.service';

describe('ListFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListFormService]
    });
  });

  it('should be created', inject([ListFormService], (service: ListFormService) => {
    expect(service).toBeTruthy();
  }));
});
