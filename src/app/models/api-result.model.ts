export interface ApiResult<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}
