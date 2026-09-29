import { ApiResult } from './api-result.model';
import { HttpResponseModel } from './http-response.model';

export function normalizeApiResponse<T>(response: HttpResponseModel<T>): ApiResult<T> {
  return {
    success: response.success ?? response.succeeded ?? true,
    statusCode: response.statusCode ?? 200,
    data: response.data,
    message: response.message ?? ''
  };
}
