import { Injectable } from '@angular/core';
import { HttpParameterCodec, HttpParams } from '@angular/common/http';
import { AdvancedFilterRequest, FilterRequest } from '../models/filter-request.model';
import { PaginationRequest } from '../models/pagination-request.model';

class EmptyValuePreservingEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

@Injectable({
  providedIn: 'root'
})
export class FilterQueryService {
  buildParams(params?: Record<string, unknown>): HttpParams {
    let httpParams = new HttpParams({ encoder: new EmptyValuePreservingEncoder() });

    if (!params) {
      return httpParams;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          httpParams = httpParams.append(key, '');
          return;
        }

        value.forEach((item) => {
          httpParams = httpParams.append(key, item != null ? String(item) : '');
        });
        return;
      }

      httpParams = httpParams.append(key, value != null ? String(value) : '');
    });

    return httpParams;
  }

  buildFilterPaginationQuery(filterRequest: FilterRequest, pagination: PaginationRequest): Record<string, unknown> {
    return {
      SearchedValue: filterRequest.searchedValue,
      ColumnsKey: filterRequest.columnsKey,
      IsPaginationRequest: pagination.isPaginationRequest,
      PageSize: pagination.pageSize,
      PageNumber: pagination.pageNumber
    };
  }

  buildAdvancedFilterPaginationQuery(filterRequest: AdvancedFilterRequest, pagination: PaginationRequest): Record<string, unknown> {
    return {
      SearchedValue: filterRequest.searchedValue,
      ColumnsKey: filterRequest.columnsKey,
      IsPaginationRequest: pagination.isPaginationRequest,
      PageSize: pagination.pageSize,
      PageNumber: pagination.pageNumber
    };
  }
}
