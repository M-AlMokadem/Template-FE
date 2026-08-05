import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  readonly serverUrl = 'http://localhost:5186/api/';
}
