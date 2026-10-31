import {Component, input, InputSignal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {WeatherCondition} from '../../../../weather-integration/domain/model/weather-condition.entity';

/**
 * Displays rain, wind and temperature of a weather condition.
 */
@Component({
    selector: 'app-mission-weather-metrics',
    imports: [MatIcon, TranslatePipe],
    templateUrl: './mission-weather-metrics.html',
    styleUrl: './mission-weather-metrics.css'
})
export class MissionWeatherMetrics {
    /**
     * Weather condition to display.
     */
    condition: InputSignal<WeatherCondition | undefined> = input<WeatherCondition | undefined>();
}