import { WeatherConditionResponse } from './weather-condition-response';
import { WeatherCondition } from '../domain/model/weather-condition.entity';

export class WeatherAssembler {
  static toEntityFromResponse(response: WeatherConditionResponse, location: string, latitude: number, longitude: number): WeatherCondition {
    return {
      id: 1,
      location,
      latitude,
      longitude,
      temperature: response.current.temperature_2m,
      humidity: response.current.relative_humidity_2m,
      windSpeed: response.current.wind_speed_10m,
      precipitation: response.current.precipitation,
      precipitationProbability: response.hourly.precipitation_probability[0] ?? 0,
      observedAt: response.current.time,
      alerts: [],
    };
  }
}
