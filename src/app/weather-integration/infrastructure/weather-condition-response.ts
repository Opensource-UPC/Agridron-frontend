import { WeatherAlertResource } from './weather-alert-resource';

export interface WeatherConditionResponse {
  id: number;
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  observedAt: string;
  alerts: WeatherAlertResource[];
}

