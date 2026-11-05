import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { WeatherSimulator } from './weather-simulator';
import { WeatherService } from '../../../../weather-integration/application/weather-service';
import { WeatherCondition } from '../../../../weather-integration/domain/model/weather-condition.entity';

const real: WeatherCondition = {
  id: 1, location: 'Cañete', temperature: 22, humidity: 70, windSpeed: 5, precipitation: 0,
  precipitationProbability: 0, observedAt: '2026-11-02T10:00', alerts: [],
};

describe('WeatherSimulator', () => {
  it('cambia las alertas al mover el viento sin modificar los datos reales', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideTranslateService()] });
    const service = TestBed.inject(WeatherService);
    service.weatherConditions.set([real]);
    const simulator = TestBed.createComponent(WeatherSimulator).componentInstance;

    expect(simulator.condition().alerts).toEqual([]);
    simulator.update('windSpeed', 18);
    expect(simulator.condition().alerts.map(alert => alert.message)).toEqual(['weather.alert.wind']);
    expect(service.weatherConditions()[0].windSpeed).toBe(5);

    simulator.reset();
    expect(simulator.condition().windSpeed).toBe(5);
  });
});
