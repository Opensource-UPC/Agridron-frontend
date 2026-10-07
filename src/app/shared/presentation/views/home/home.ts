import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthenticationService} from '../../../../iam/application/authentication.service';
import {WeatherWidget} from '../../components/weather-widget/weather-widget';
import {WeatherService} from '../../../../weather-integration/application/weather-service';
import {FarmStore} from '../../../../fieldManagement/application/farm.store';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {CropStore} from '../../../../fieldManagement/application/crop.store';
import {FumigationAreaStore} from '../../../../fieldManagement/application/fumigation-area.store';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIcon, RouterLink, TranslatePipe, WeatherWidget],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly authService = inject(AuthenticationService);
  private readonly farmStore = inject(FarmStore);
  private readonly parcelStore = inject(ParcelStore);
  private readonly cropStore = inject(CropStore);
  private readonly fumigationAreaStore = inject(FumigationAreaStore);
  private readonly weatherService = inject(WeatherService);

  /**
   * Creates an instance of Home and loads the initial weather data.
   */
  constructor() {
    this.weatherService.loadWeatherConditions();
  }

  readonly currentUser = this.authService.currentUser;

  readonly username = computed(() => this.currentUser()?.username ?? '');

  readonly role = computed(() => this.currentUser()?.role ?? '');

  readonly email = computed(() => this.currentUser()?.email ?? '');

  readonly metrics = computed(() => [
    {icon: 'agriculture', label: 'home.metrics.farms', value: this.farmStore.farmCount()},
    {icon: 'grid_view', label: 'home.metrics.parcels', value: this.parcelStore.parcelCount()},
    {icon: 'grass', label: 'home.metrics.crops', value: this.cropStore.cropCount()},
    {icon: 'science', label: 'home.metrics.fumigationAreas', value: this.fumigationAreaStore.fumigationAreaCount()}
  ]);

  readonly shortcuts = [
    {link: '/farms', icon: 'agriculture', label: 'option.farm'},
    {link: '/parcels', icon: 'grid_view', label: 'option.parcel'},
    {link: '/crops', icon: 'grass', label: 'option.crop'},
    {link: '/fumigation-areas', icon: 'science', label: 'option.fumigationArea'},
    {link: '/analytics', icon: 'insights', label: 'option.analytics'},
    {link: '/drones', icon: 'Drone', label: 'option.drone'}
  ];
}