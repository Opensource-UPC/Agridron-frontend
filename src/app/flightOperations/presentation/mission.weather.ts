import {WeatherAlert} from '../../weather-integration/domain/model/weather-alert.entity';
import {WeatherCondition} from '../../weather-integration/domain/model/weather-condition.entity';

/**
 * Alerts that stop a mission before take-off (CL-002): only the high ones, that is,
 * wind over 15 km/h or rain. Medium and low alerts are advice shown by the weather widget.
 */
export function blockingAlerts(weather: WeatherCondition): WeatherAlert[] {
    return weather.alerts.filter(alert => alert.severity === 'HIGH');
}
