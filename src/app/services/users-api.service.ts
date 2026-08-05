import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterRequest } from '../models/filter-request.model';
import { HttpResponseModel } from '../models/http-response.model';
import { PagedResult } from '../models/paged-result.model';
import { PaginationRequest } from '../models/pagination-request.model';
import { ApiCoreService } from './api-core.service';
import { PublicService } from './public.service';

export interface UserSummaryDto {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private readonly publicService = inject(PublicService);
  private readonly apiCore = inject(ApiCoreService);
  private readonly usersController = 'users';

  getPaged(
    paginationRequest: PaginationRequest,
    filterRequest: FilterRequest = { searchedValue: '', columnsKey: [] }
  ): Observable<HttpResponseModel<PagedResult<UserSummaryDto>>> {
    return this.publicService.getFilterPaginationData<UserSummaryDto>(
      this.usersController,
      paginationRequest,
      filterRequest
    );
  }

  getById(id: string): Observable<HttpResponseModel<UserSummaryDto>> {
    return this.publicService.getById<UserSummaryDto>(this.usersController, id);
  }

  updateStatus(id: string, request: UpdateUserStatusRequest): Observable<HttpResponseModel<UserSummaryDto>> {
    return this.publicService.put<HttpResponseModel<UserSummaryDto>>(request, this.usersController, `${id}/status`);
  }

  remove(id: string): Observable<HttpResponseModel<boolean>> {
    return this.publicService.delete<HttpResponseModel<boolean>>(this.usersController, id);
  }

  getCurrentProfile(): Observable<{ id: string; fullName: string; email: string }> {
    return this.apiCore.get<{ id: string; fullName: string; email: string }>('auth/me');
  }
}
