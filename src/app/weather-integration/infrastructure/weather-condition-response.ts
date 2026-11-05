/**
 * Current conditions and next-hour rain probability returned by the Open-Meteo forecast endpoint.
 */
export interface WeatherConditionResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
  };
  hourly: {
    precipitation_probability: number[];
  };
}
