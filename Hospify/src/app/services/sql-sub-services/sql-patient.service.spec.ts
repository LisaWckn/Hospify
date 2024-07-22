import { TestBed } from '@angular/core/testing';

import { SqlPatientService } from './sql-patient.service';

describe('SqlPatientService', () => {
  let service: SqlPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
