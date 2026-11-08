import { inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { WeatherApi } from '../infrastructure/weather-api';
import { WeatherAssembler } from '../infrastructure/weather-assembler';
import { WeatherConditionResponse } from '../infrastructure/weather-condition-response';
import { WeatherCondition } from '../domain/model/weather-condition.entity';
import { WeatherAlert } from '../domain/model/weather-alert.entity';
import { ALERT_RULES, isSuitable as isSuitableForSpraying } from '../domain/model/weather-rules';

/** Reference location used when the user does not share their position. */
const DEFAULT_LOCATION = { name: 'Cañete', latitude: -13.08, longitude: -76.39 };

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private weatherApi = inject(WeatherApi);

  weatherConditions = signal<WeatherCondition[]>([]);

  /** True when the weather shown belongs to the reference location. */
  usingDefaultLocation = signal(false);

  /** True while the weather is being requested (including the wait for the user's location). */
  loading = signal(false);

  /**
   * Loads the weather of the user's location, or of the reference location if it is not shared.
   */
  loadWeatherConditions() {
    this.loading.set(true);
    const useDefault = () => this.loadWeather(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, of(DEFAULT_LOCATION.name), true);
    if (!navigator.geolocation) return useDefault();
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const coordinates = `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`;
      const placeName = this.weatherApi.getLocationName(coords.latitude, coords.longitude).pipe(
        map(name => name || coordinates),
        catchError(() => of(coordinates)),
      );
      this.loadWeather(coords.latitude, coords.longitude, placeName, false);
    }, useDefault);
  }

  /**
   * Generates the alerts of a weather condition from the alert rules.
   */
  evaluateConditions(weather: WeatherCondition): WeatherAlert[] {
    return ALERT_RULES.filter(rule => rule.applies(weather)).map((rule, index) => ({
      id: index + 1,
      severity: rule.severity,
      message: rule.message,
      createdAt: weather.observedAt,
    }));
  }

  /**
   * Tells whether the conditions are favorable for spraying. It is information, not an alert.
   */
  isSuitable(weather: WeatherCondition) {
    return isSuitableForSpraying(weather);
  }

  /**
   * Gets the weather of a given point, e.g. the center of a mission parcel.
   * It does not change weatherConditions, so the Home widget keeps showing the user's location.
   */
  getWeatherAt(latitude: number, longitude: number, name: string): Observable<WeatherCondition> {
    return this.weatherApi.getWeather(latitude, longitude).pipe(
      map(response => this.toCondition(response, name, latitude, longitude)),
    );
  }

  /** Builds the weather condition of the API response and evaluates its alerts. */
  private toCondition(response: WeatherConditionResponse, name: string, latitude: number, longitude: number): WeatherCondition {
    const condition = WeatherAssembler.toEntityFromResponse(response, name, latitude, longitude);
    condition.alerts = this.evaluateConditions(condition);
    return condition;
  }

  private loadWeather(latitude: number, longitude: number, location: Observable<string>, isDefault: boolean) {
    forkJoin([this.weatherApi.getWeather(latitude, longitude), location]).subscribe({
      next: ([response, name]) => {
        const condition = this.toCondition(response, name, latitude, longitude);
        this.usingDefaultLocation.set(isDefault);
        this.weatherConditions.set([condition]);
        this.loading.set(false);
      },
      error: () => {
        this.weatherConditions.set([]);
        this.loading.set(false);
      },
    });
  }
}
