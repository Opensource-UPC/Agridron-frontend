import { WeatherAlert } from './weather-alert.entity';

export interface WeatherCondition {
  id: number;
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  precipitationProbability: number;
  observedAt: string;
  alerts: WeatherAlert[];
}
