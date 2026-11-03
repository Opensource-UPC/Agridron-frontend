import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { WeatherConditionResponse } from './weather-condition-response';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherApi {
  private http = inject(HttpClient);

  private baseUrlPath = environment.weatherApiBaseUrl;
  private endpointPath = environment.weatherEndpointPath;

  /**
   * Gets the current weather of a location and the rain probability of the next hour from Open-Meteo.
   */
  getWeather(latitude: number, longitude: number) {
    return this.http.get<WeatherConditionResponse>(`${this.baseUrlPath}${this.endpointPath}`, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation',
        hourly: 'precipitation_probability',
        forecast_hours: 1,
        timezone: 'auto',
      },
    });
  }

  /**
   * Gets the city, district or locality name of a position from BigDataCloud.
   */
  getLocationName(latitude: number, longitude: number) {
    return this.http
      .get<{ city: string; locality: string; principalSubdivision: string }>(environment.reverseGeocodingUrl, {
        params: { latitude, longitude, localityLanguage: 'es' },
      })
      .pipe(map(place => place.city || place.locality || place.principalSubdivision));
  }
}
