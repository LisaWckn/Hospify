import { TestBed } from '@angular/core/testing';

import { SqlMitarbeiterService } from './sql-mitarbeiter.service';

describe('SqlMitarbeiterService', () => {
  let service: SqlMitarbeiterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlMitarbeiterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
