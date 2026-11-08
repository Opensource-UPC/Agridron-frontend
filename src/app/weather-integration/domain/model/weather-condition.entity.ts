import { WeatherAlert } from './weather-alert.entity';

export interface WeatherCondition {
  id: number;
  location: string;
  /** Coordinates the weather data was requested for. */
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  precipitationProbability: number;
  observedAt: string;
  alerts: WeatherAlert[];
}
