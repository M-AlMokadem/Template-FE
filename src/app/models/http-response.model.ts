export interface HttpResponseModel<T> {
  succeeded: boolean;
  message?: string;
  errors?: string[];
  data: T;
}
