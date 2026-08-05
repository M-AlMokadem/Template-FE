import { HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdvancedFilterRequest, FilterRequest } from '../models/filter-request.model';
import { HttpResponseModel } from '../models/http-response.model';
import { PagedResult } from '../models/paged-result.model';
import { PaginationRequest } from '../models/pagination-request.model';
import { ApiCoreService } from './api-core.service';
import { FileExportService } from './file-export.service';
import { FilterQueryService } from './filter-query.service';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private readonly api = inject(ApiCoreService);
  private readonly filterQuery = inject(FilterQueryService);
  private readonly fileExportService = inject(FileExportService);

  getAll<T>(apiController: string): Observable<HttpResponseModel<T[]>> {
    return this.api.get<HttpResponseModel<T[]>>(apiController);
  }

  getById<T>(apiController: string, id: string | number): Observable<HttpResponseModel<T>> {
    return this.api.getById<HttpResponseModel<T>>(apiController, id);
  }

  getFilterPaginationData<T>(
    apiController: string,
    paginationRequest: PaginationRequest,
    filterRequest: FilterRequest = { searchedValue: '', columnsKey: [] }
  ): Observable<HttpResponseModel<PagedResult<T>>> {
    const params = this.filterQuery.buildFilterPaginationQuery(filterRequest, paginationRequest);
    return this.getData<HttpResponseModel<PagedResult<T>>>(apiController, params);
  }

  getFilterPaginationQueueData<T>(
    apiController: string,
    paginationRequest: PaginationRequest,
    filterRequest: AdvancedFilterRequest = { searchedValue: [], columnsKey: [] }
  ): Observable<HttpResponseModel<PagedResult<T>>> {
    const params = this.filterQuery.buildAdvancedFilterPaginationQuery(filterRequest, paginationRequest);
    return this.getData<HttpResponseModel<PagedResult<T>>>(apiController, params);
  }

  getData<T>(apiController: string, params?: Record<string, unknown>): Observable<T> {
    const httpParams = this.filterQuery.buildParams(params);
    return this.api.get<T>(apiController, { params: httpParams });
  }

  get<T>(apiController: string, paramValue: string | number | boolean, paramName: string): Observable<T> {
    const params = this.filterQuery.buildParams({ [paramName]: paramValue });
    return this.api.get<T>(apiController, { params });
  }

  post<T>(data: unknown, apiController: string, action?: string): Observable<T> {
    return this.api.post<T>(apiController, data, action);
  }

  put<T>(data: unknown, apiController: string, action?: string): Observable<T> {
    return this.api.put<T>(apiController, data, action);
  }

  patch<T>(apiController: string, data: unknown, action?: string): Observable<T> {
    return this.api.patch<T>(apiController, data, action);
  }

  delete<T>(apiController: string, action?: string, options?: { params?: Record<string, unknown>; body?: unknown }): Observable<T> {
    const params = options?.params ? this.filterQuery.buildParams(options.params) : undefined;
    return this.api.delete<T>(apiController, action, {
      params,
      body: options?.body
    });
  }

  getPdf(apiController: string, action: string): Observable<Blob> {
    return this.api.getBlob(apiController, action);
  }

  export(apiController: string, body: unknown = null): Observable<Blob> {
    return this.api.postBlob(apiController, body);
  }

  filterExport(
    apiController: string,
    paginationRequest: PaginationRequest,
    filterRequest: AdvancedFilterRequest = { searchedValue: [], columnsKey: [] }
  ): Observable<Blob> {
    const payload = {
      filter: {
        SearchedValue: filterRequest.searchedValue,
        ColumnsKey: filterRequest.columnsKey
      },
      pagination: {
        IsPaginationRequest: paginationRequest.isPaginationRequest,
        PageSize: paginationRequest.pageSize,
        PageNumber: paginationRequest.pageNumber
      }
    };

    return this.api.postBlob(apiController, payload);
  }

  remove<T>(data: unknown, apiController: string, action?: string): Observable<T> {
    if (action) {
      return this.api.delete<T>(apiController, action, { body: data });
    }

    return this.api.post<T>(apiController, data);
  }

  downloadFile(response: HttpResponse<Blob>): void {
    this.fileExportService.downloadFile(response);
  }
}
