import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherConditionResponse } from './weather-condition-response';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherApi {
  private http = inject(HttpClient);

  private baseUrlPath = environment.weatherApiBaseUrl;
  private endpointPath = environment.weatherEndpointPath;

  getWeather() {
    return this.http.get<WeatherConditionResponse[]>(`${this.baseUrlPath}${this.endpointPath}`);
  }
}
