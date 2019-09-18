import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthoAuthorizationServiceService } from './autho-authorization-service.service';

describe('AuthoAuthorizationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule
    ]
  }));

  it('should be created', () => {
    const service: AuthoAuthorizationServiceService = TestBed.get(AuthoAuthorizationServiceService);
    expect(service).toBeTruthy();
  });
});
