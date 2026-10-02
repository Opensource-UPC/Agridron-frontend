import { Component, inject, Signal } from '@angular/core';
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
  private weatherService = inject(WeatherService);

  weatherConditions: Signal<WeatherCondition[]> = this.weatherService.weatherConditions;
}
