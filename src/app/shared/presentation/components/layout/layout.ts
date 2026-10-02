import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderContent } from '../header-content/header-content';
import { FooterContent } from '../footer-content/footer-content';
import { WeatherWidget } from '../weather-widget/weather-widget';
import { WeatherService } from '../../../../weather-integration/application/weather-service';


@Component({
  imports: [HeaderContent, WeatherWidget, FooterContent, RouterOutlet],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout implements OnInit {
  private weatherService = inject(WeatherService);

  constructor() {
    this.weatherService.loadWeatherConditions();
  }

  ngOnInit(): void {

  }
}