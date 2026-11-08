import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { WeatherService } from './weather-service';
import { WeatherCondition } from '../domain/model/weather-condition.entity';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

/** Neutral condition: favorable and without alerts. Each test changes only what it checks. */
const weather = (changes: Partial<WeatherCondition> = {}): WeatherCondition => ({
  id: 1, location: 'Cañete', latitude: -13.08, longitude: -76.39, temperature: 22, humidity: 70, windSpeed: 5, precipitation: 0,
  precipitationProbability: 0, observedAt: '2026-11-02T10:00', alerts: [], ...changes,
});

const response = (windSpeed: number) => ({
  current: { time: '2026-11-02T10:00', temperature_2m: 22, relative_humidity_2m: 70, wind_speed_10m: windSpeed, precipitation: 0 },
  hourly: { precipitation_probability: [10] },
});

/** Replaces the browser geolocation: granted returns Lima, denied calls the error callback. */
const mockGeolocation = (granted: boolean) => Object.defineProperty(navigator, 'geolocation', {
  configurable: true,
  value: {
    getCurrentPosition: (success: PositionCallback, error: PositionErrorCallback) =>
      granted ? success({ coords: { latitude: -12.05, longitude: -77.04 } } as GeolocationPosition) : error({} as GeolocationPositionError),
  },
});

describe('WeatherService', () => {
  let service: WeatherService;
  let http: HttpTestingController;
  const alerts = (changes: Partial<WeatherCondition>) =>
    service.evaluateConditions(weather(changes)).map(alert => `${alert.severity} ${alert.message}`);

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(WeatherService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('reglas del informe', () => {
    it('CL-002: viento mayor a 15 km/h genera alerta alta', () => {
      expect(alerts({ windSpeed: 15.5 })).toEqual(['HIGH weather.alert.wind']);
    });
    it('4.4: lluvia detectada genera alerta alta', () => {
      expect(alerts({ precipitation: 0.2 })).toEqual(['HIGH weather.alert.rain']);
    });
    it('CL-003: condiciones favorables con viento de 15 km/h o menos, menos de 28 °C y sin lluvia', () => {
      expect(service.isSuitable(weather({ windSpeed: 15, temperature: 27.9 }))).toBe(true);
      expect(service.isSuitable(weather({ temperature: 28 }))).toBe(false);
      expect(service.isSuitable(weather({ windSpeed: 15.5 }))).toBe(false);
      expect(service.isSuitable(weather({ precipitation: 0.2 }))).toBe(false);
    });
    it('el mensaje favorable no es una alerta', () => {
      expect(alerts({})).toEqual([]);
    });
  });

  describe('reglas propuestas por el equipo', () => {
    it('viento entre 10 y 15 km/h: alerta media', () => {
      expect(alerts({ windSpeed: 10 })).toEqual([]);
      expect(alerts({ windSpeed: 12 })).toEqual(['MEDIUM weather.alert.moderateWind']);
      expect(alerts({ windSpeed: 15 })).toEqual(['MEDIUM weather.alert.moderateWind']);
    });
    it('viento menor a 3 km/h: alerta baja', () => {
      expect(alerts({ windSpeed: 2 })).toEqual(['LOW weather.alert.calmWind']);
    });
    it('probabilidad de lluvia: baja desde 40 % y media desde 70 %', () => {
      expect(alerts({ precipitationProbability: 39 })).toEqual([]);
      expect(alerts({ precipitationProbability: 40 })).toEqual(['LOW weather.alert.rainPossible']);
      expect(alerts({ precipitationProbability: 70 })).toEqual(['MEDIUM weather.alert.rainLikely']);
    });
    it('temperatura mayor a 30 °C: alerta media', () => {
      expect(alerts({ temperature: 30 })).toEqual([]);
      expect(alerts({ temperature: 31 })).toEqual(['MEDIUM weather.alert.heat']);
    });
    it('humedad menor a 50 %: alerta baja', () => {
      expect(alerts({ humidity: 49 })).toEqual(['LOW weather.alert.lowHumidity']);
    });
    it('las condiciones se combinan', () => {
      expect(alerts({ windSpeed: 20, precipitation: 1, precipitationProbability: 80, temperature: 33, humidity: 40 })).toEqual([
        'HIGH weather.alert.wind', 'HIGH weather.alert.rain', 'MEDIUM weather.alert.rainLikely', 'MEDIUM weather.alert.heat', 'LOW weather.alert.lowHumidity',
      ]);
    });
  });

  describe('ubicación y API', () => {
    it('con permiso muestra el nombre real de la ubicación', () => {
      mockGeolocation(true);
      service.loadWeatherConditions();
      const forecast = http.expectOne(r => r.url === FORECAST_URL);
      expect(forecast.request.params.get('latitude')).toBe('-12.05');
      forecast.flush(response(20));
      http.expectOne(r => r.url === GEOCODING_URL).flush({ city: 'Lima', locality: 'Cercado de Lima', principalSubdivision: 'Lima' });
      const [condition] = service.weatherConditions();
      expect(condition.location).toBe('Lima');
      expect(condition.precipitationProbability).toBe(10);
      expect(condition.alerts.map(alert => alert.message)).toEqual(['weather.alert.wind']);
      expect(service.usingDefaultLocation()).toBe(false);
    });

    it('si no se obtiene el nombre muestra las coordenadas reales', () => {
      mockGeolocation(true);
      service.loadWeatherConditions();
      http.expectOne(r => r.url === FORECAST_URL).flush(response(5));
      http.expectOne(r => r.url === GEOCODING_URL).flush('error', { status: 500, statusText: 'Server Error' });
      expect(service.weatherConditions()[0].location).toBe('-12.05, -77.04');
    });

    it('sin permiso usa Cañete como ubicación de referencia', () => {
      mockGeolocation(false);
      service.loadWeatherConditions();
      const forecast = http.expectOne(r => r.url === FORECAST_URL);
      expect(forecast.request.params.get('latitude')).toBe('-13.08');
      forecast.flush(response(5));
      expect(service.weatherConditions()[0].location).toBe('Cañete');
      expect(service.usingDefaultLocation()).toBe(true);
    });

    it('TU-005 escenario 2: si la API falla no hay condiciones y el widget muestra "sin datos"', () => {
      mockGeolocation(false);
      service.weatherConditions.set([weather()]);
      service.loadWeatherConditions();
      http.expectOne(r => r.url === FORECAST_URL).flush('error', { status: 500, statusText: 'Server Error' });
      expect(service.weatherConditions()).toEqual([]);
    });
  });
});
