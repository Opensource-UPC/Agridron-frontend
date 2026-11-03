import { WeatherCondition } from './weather-condition.entity';

/**
 * Alert rules. The first two come from the report (CL-002 and the 4.4 user flow).
 * The rest are rules proposed by the team, not values set by the report.
 */
export const ALERT_RULES: { severity: string; message: string; applies: (weather: WeatherCondition) => boolean }[] = [
  { severity: 'HIGH', message: 'weather.alert.wind', applies: weather => weather.windSpeed > 15 },
  { severity: 'HIGH', message: 'weather.alert.rain', applies: weather => weather.precipitation > 0 },
  { severity: 'MEDIUM', message: 'weather.alert.moderateWind', applies: weather => weather.windSpeed > 10 && weather.windSpeed <= 15 },
  { severity: 'LOW', message: 'weather.alert.calmWind', applies: weather => weather.windSpeed < 3 },
  { severity: 'MEDIUM', message: 'weather.alert.rainLikely', applies: weather => weather.precipitationProbability >= 70 },
  { severity: 'LOW', message: 'weather.alert.rainPossible', applies: weather => weather.precipitationProbability >= 40 && weather.precipitationProbability < 70 },
  { severity: 'MEDIUM', message: 'weather.alert.heat', applies: weather => weather.temperature > 30 },
  { severity: 'LOW', message: 'weather.alert.lowHumidity', applies: weather => weather.humidity < 50 },
];

/**
 * Favorable spraying conditions: wind of 15 km/h or less and temperature below 28 °C (CL-003), and no rain.
 */
export const isSuitable = (weather: WeatherCondition) =>
  weather.windSpeed <= 15 && weather.temperature < 28 && weather.precipitation === 0;
