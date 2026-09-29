/// <reference types="jasmine" />

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UsersApiService } from './users-api.service';

describe('UsersApiService', () => {
  let service: UsersApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UsersApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('normalizes a user response from the API wrapper', () => {
    service.getById('user-id').subscribe((result) => {
      expect(result.success).toBeTrue();
      expect(result.statusCode).toBe(200);
      expect(result.data.email).toBe('user@example.com');
    });

    const request = httpTesting.expectOne('http://localhost:5186/api/users/user-id');
    expect(request.request.method).toBe('GET');
    request.flush({
      success: true,
      statusCode: 200,
      message: 'User retrieved successfully.',
      data: {
        id: 'user-id',
        fullName: 'Test User',
        email: 'user@example.com',
        isActive: true
      }
    });
  });
});
