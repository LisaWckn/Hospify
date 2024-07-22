import { TestBed } from '@angular/core/testing';

import { SqlQueriesService } from './sql-queries.service';

describe('SqlQueriesService', () => {
  let service: SqlQueriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlQueriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
