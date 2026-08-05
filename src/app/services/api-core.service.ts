import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCoreService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  private buildUrl(controller: string, action?: string): string {
    const normalizedController = controller.startsWith('/') ? controller.slice(1) : controller;
    const actionPath = action ? `/${action}` : '';
    return `${this.appConfig.serverUrl}${normalizedController}${actionPath}`;
  }

  get<T>(controller: string, options?: { params?: HttpParams | Record<string, string | number | boolean> }): Observable<T> {
    const requestOptions: {
      headers: HttpHeaders;
      params?: HttpParams | Record<string, string | number | boolean>;
      observe: 'body';
      responseType: 'json';
    } = {
      headers: this.defaultHeaders,
      params: options?.params,
      observe: 'body',
      responseType: 'json'
    };

    return this.http.get<T>(this.buildUrl(controller), {
      ...requestOptions
    });
  }

  getById<T>(controller: string, id: string | number): Observable<T> {
    return this.http.get<T>(this.buildUrl(controller, String(id)), {
      headers: this.defaultHeaders
    });
  }

  post<T>(controller: string, body: unknown, action?: string): Observable<T> {
    return this.http.post<T>(this.buildUrl(controller, action), body, {
      headers: this.defaultHeaders
    });
  }

  put<T>(controller: string, body: unknown, action?: string): Observable<T> {
    return this.http.put<T>(this.buildUrl(controller, action), body, {
      headers: this.defaultHeaders
    });
  }

  patch<T>(controller: string, body: unknown, action?: string): Observable<T> {
    return this.http.patch<T>(this.buildUrl(controller, action), body, {
      headers: this.defaultHeaders
    });
  }

  delete<T>(controller: string, action?: string, options?: { params?: HttpParams; body?: unknown }): Observable<T> {
    return this.http.delete<T>(this.buildUrl(controller, action), {
      headers: this.defaultHeaders,
      params: options?.params,
      body: options?.body
    });
  }

  postBlob(controller: string, body: unknown, action?: string): Observable<Blob> {
    return this.http.post(this.buildUrl(controller, action), body, {
      headers: this.defaultHeaders,
      responseType: 'blob'
    });
  }

  getBlob(controller: string, action?: string): Observable<Blob> {
    return this.http.get(this.buildUrl(controller, action), {
      headers: this.defaultHeaders,
      responseType: 'blob'
    });
  }
}
