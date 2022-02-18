import { TestBed } from '@angular/core/testing';

import { ServerDataSourceService } from './server-data-source.service';

describe('ServerDataSourceService', () => {
  let service: ServerDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
