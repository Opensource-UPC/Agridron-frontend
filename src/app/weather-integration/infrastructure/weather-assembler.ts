import { WeatherAlertResource } from './weather-alert-resource';
import { WeatherConditionResponse } from './weather-condition-response';
import { WeatherAlert } from '../domain/model/weather-alert.entity';
import { WeatherCondition } from '../domain/model/weather-condition.entity';

export class WeatherAssembler {
  static toEntityFromResource(resource: WeatherAlertResource): WeatherAlert {
    return {
      id: resource.id,
      severity: resource.severity,
      message: resource.message,
      createdAt: resource.createdAt,
    };
  }

  static toEntityFromResponse(response: WeatherConditionResponse): WeatherCondition {
    return {
      id: response.id,
      location: response.location,
      temperature: response.temperature,
      humidity: response.humidity,
      windSpeed: response.windSpeed,
      precipitation: response.precipitation,
      observedAt: response.observedAt,
      alerts: response.alerts.map(alert => this.toEntityFromResource(alert)),
    };
  }

  static toEntityFromResponseArray(responseArray: WeatherConditionResponse[]): WeatherCondition[] {
    return responseArray.map(response => this.toEntityFromResponse(response));
  }
}
