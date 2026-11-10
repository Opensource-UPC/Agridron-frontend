import { Component, computed, inject, input, Signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { WeatherService } from '../../../../weather-integration/application/weather-service';
import { WeatherCondition } from '../../../../weather-integration/domain/model/weather-condition.entity';

@Component({
  imports: [DatePipe, MatIcon, TranslatePipe],
  selector: 'app-weather-widget',
  styleUrl: './weather-widget.css',
  templateUrl: './weather-widget.html',
})
export class WeatherWidget {
  protected weatherService = inject(WeatherService);

  weatherConditions: Signal<WeatherCondition[]> = this.weatherService.weatherConditions;

  /** Optional condition shown instead of the loaded one (used by the weather simulator). */
  condition = input<WeatherCondition>();

  shownCondition = computed(() => this.condition() ?? this.weatherConditions()[0]);

  /** Secondary readings shown in the widget grid. */
  readings = computed(() => {
    const condition = this.shownCondition();
    if (!condition) return [];
    return [
      { icon: 'agd:humidity', label: 'weather.humidity', value: `${condition.humidity}%` },
      { icon: 'agd:wind', label: 'weather.wind', value: `${condition.windSpeed} km/h` },
      { icon: 'agd:precipitation', label: 'weather.precipitation', value: `${condition.precipitation} mm` },
      { icon: 'agd:rain-probability', label: 'weather.precipitationProbability', value: `${condition.precipitationProbability}%` }
    ];
  });
}
