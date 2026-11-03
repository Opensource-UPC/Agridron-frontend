import { Component, computed, inject, input, Signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { WeatherService } from '../../../../weather-integration/application/weather-service';
import { WeatherCondition } from '../../../../weather-integration/domain/model/weather-condition.entity';

@Component({
  imports: [DatePipe, TranslatePipe],
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
}
