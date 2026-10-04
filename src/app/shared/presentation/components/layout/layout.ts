import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderContent} from '../header-content/header-content';
import {FooterContent} from '../footer-content/footer-content';
import {SideNav} from '../side-nav/side-nav';
import {WeatherWidget} from '../weather-widget/weather-widget';
import {WeatherService} from '../../../../weather-integration/application/weather-service';


@Component({
  imports: [HeaderContent, SideNav, FooterContent, RouterOutlet, WeatherWidget],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {
  private readonly weatherService = inject(WeatherService);

  /**
   * Indicates if the side navigation is visible.
   */
  readonly sidebarOpen = signal(true);

  /**
   * Creates an instance of Layout and loads the initial weather data.
   */
  constructor() {
    this.weatherService.loadWeatherConditions();
  }

  /**
   * Toggles the side navigation visibility.
   */
  readonly toggleSidebar = (): void => {
    this.sidebarOpen.update(open => !open);
  };

  /**
   * Closes the side navigation.
   */
  readonly closeSidebar = (): void => {
    this.sidebarOpen.set(false);
  };
}