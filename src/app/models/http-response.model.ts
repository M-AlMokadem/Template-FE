import { ApiResult } from './api-result.model';

export interface HttpResponseModel<T> {
  // Kept for backward compatibility with older endpoints.
  succeeded?: boolean;
  success?: boolean;
  statusCode?: number;
  message?: string;
  errors?: string[];
  data: T;
}

export type LegacyHttpResponseModel<T> = HttpResponseModel<T> & ApiResult<T>;
