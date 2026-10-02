import { inject, Injectable, signal } from '@angular/core';
import { WeatherApi } from '../infrastructure/weather-api';
import { WeatherAssembler } from '../infrastructure/weather-assembler';
import { WeatherCondition } from '../domain/model/weather-condition.entity';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private weatherApi = inject(WeatherApi);

  weatherConditions = signal<WeatherCondition[]>([]);

  loadWeatherConditions() {
    this.weatherApi.getWeather().subscribe(responseArray =>
      this.weatherConditions.set(WeatherAssembler.toEntityFromResponseArray(responseArray)));
  }
}
