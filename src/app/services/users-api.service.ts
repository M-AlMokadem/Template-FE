import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResult } from '../models/api-result.model';
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
  ): Observable<ApiResult<PagedResult<UserSummaryDto>>> {
    return this.publicService.getFilterPaginationData<UserSummaryDto>(
      this.usersController,
      paginationRequest,
      filterRequest
    ).pipe(map((response) => this.normalizeResult(response)));
  }

  getById(id: string): Observable<ApiResult<UserSummaryDto>> {
    return this.publicService.getById<UserSummaryDto>(this.usersController, id)
      .pipe(map((response) => this.normalizeResult(response)));
  }

  updateStatus(id: string, request: UpdateUserStatusRequest): Observable<ApiResult<UserSummaryDto>> {
    return this.publicService.put<HttpResponseModel<UserSummaryDto>>(request, this.usersController, `${id}/status`)
      .pipe(map((response) => this.normalizeResult(response)));
  }

  remove(id: string): Observable<ApiResult<boolean>> {
    return this.publicService.delete<HttpResponseModel<boolean>>(this.usersController, id)
      .pipe(map((response) => this.normalizeResult(response)));
  }

  getCurrentProfile(): Observable<{ id: string; fullName: string; email: string }> {
    return this.apiCore.get<{ id: string; fullName: string; email: string }>('auth/me');
  }

  private normalizeResult<T>(response: HttpResponseModel<T>): ApiResult<T> {
    return {
      success: response.success ?? response.succeeded ?? true,
      statusCode: response.statusCode ?? 200,
      data: response.data,
      message: response.message ?? ''
    };
  }
}
