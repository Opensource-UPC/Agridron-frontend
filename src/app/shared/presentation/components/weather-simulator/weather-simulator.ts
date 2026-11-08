import { Component, computed, inject, linkedSignal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WeatherService } from '../../../../weather-integration/application/weather-service';
import { WeatherCondition } from '../../../../weather-integration/domain/model/weather-condition.entity';
import { WeatherWidget } from '../weather-widget/weather-widget';

/** Values used when the real weather could not be loaded. */
const BASELINE: WeatherCondition = {
  id: 0, location: 'Simulación', latitude: 0, longitude: 0, temperature: 20, humidity: 60, windSpeed: 5,
  precipitation: 0, precipitationProbability: 0, observedAt: new Date().toISOString(), alerts: [],
};

/**
 * Debug panel (environment.debugMode) that simulates weather values to test the alert rules.
 * It works on a copy, so the data loaded from the weather API never changes.
 */
@Component({
  imports: [TranslatePipe, WeatherWidget],
  selector: 'app-weather-simulator',
  styleUrl: './weather-simulator.css',
  templateUrl: './weather-simulator.html',
})
export class WeatherSimulator {
  private weatherService = inject(WeatherService);

  readonly sliders = [
    { key: 'windSpeed', label: 'weather.wind', unit: 'km/h', max: 40, step: 0.5 },
    { key: 'temperature', label: 'weather.temperature', unit: '°C', max: 45, step: 0.5 },
    { key: 'precipitationProbability', label: 'weather.precipitationProbability', unit: '%', max: 100, step: 1 },
    { key: 'precipitation', label: 'weather.precipitation', unit: 'mm', max: 20, step: 0.1 },
    { key: 'humidity', label: 'weather.humidity', unit: '%', max: 100, step: 1 },
  ] as const;

  /** Simulated copy that starts with the real values. */
  readonly simulated = linkedSignal(() => ({ ...(this.weatherService.weatherConditions()[0] ?? BASELINE) }));

  /** Simulated condition with its alerts evaluated by the same rules the app uses. */
  readonly condition = computed(() => ({ ...this.simulated(), alerts: this.weatherService.evaluateConditions(this.simulated()) }));

  update(key: (typeof this.sliders)[number]['key'], value: number) {
    this.simulated.update(weather => ({ ...weather, [key]: value }));
  }

  reset() {
    this.simulated.set({ ...(this.weatherService.weatherConditions()[0] ?? BASELINE) });
  }
}
