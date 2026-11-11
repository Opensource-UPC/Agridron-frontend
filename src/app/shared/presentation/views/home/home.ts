import {ChangeDetectionStrategy, Component, computed, effect, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthenticationService} from '../../../../iam/application/authentication.service';
import {WeatherWidget} from '../../components/weather-widget/weather-widget';
import {WeatherSimulator} from '../../components/weather-simulator/weather-simulator';
import {environment} from '../../../../../environments/environment';
import {WeatherService} from '../../../../weather-integration/application/weather-service';
import {FarmStore} from '../../../../fieldManagement/application/farm.store';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {CropStore} from '../../../../fieldManagement/application/crop.store';
import {FumigationAreaStore} from '../../../../fieldManagement/application/fumigation-area.store';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIcon, RouterLink, TranslatePipe, WeatherWidget, WeatherSimulator],
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

  /** Shows the weather simulator instead of the widget (local tests only). */
  readonly debugMode = environment.debugMode;

  /**
   * Creates an instance of Home and loads the initial data.
   *
   * <p>Fumigation areas are only exposed per parcel by the backend, so the metric is fed by
   * requesting the areas of every known parcel once the parcel collection is available.</p>
   */
  constructor() {
    this.weatherService.loadWeatherConditions();
    effect(() => {
      const parcelIds = this.parcelStore.parcels().map(parcel => parcel.id);
      this.fumigationAreaStore.loadFumigationAreasForParcels(parcelIds);
    });
  }

  readonly currentUser = this.authService.currentUser;

  readonly username = computed(() => this.currentUser()?.username ?? '');

  readonly role = computed(() => this.currentUser()?.role ?? '');

  readonly email = computed(() => this.currentUser()?.email ?? '');

  readonly metrics = computed(() => [
    {
      icon: 'agd:farm', label: 'home.metrics.farms', loadingLabel: 'farm.loading',
      value: this.farmStore.farmCount(), loading: this.farmStore.loading()
    },
    {
      icon: 'agd:parcel', label: 'home.metrics.parcels', loadingLabel: 'parcel.loading',
      value: this.parcelStore.parcelCount(), loading: this.parcelStore.loading()
    },
    {
      icon: 'agd:crop', label: 'home.metrics.crops', loadingLabel: 'crop.loading',
      value: this.cropStore.cropCount(), loading: this.cropStore.loading()
    },
    {
      icon: 'agd:fumigation', label: 'home.metrics.fumigationAreas', loadingLabel: 'fumigationArea.loading',
      value: this.fumigationAreaStore.fumigationAreaCount(), loading: this.fumigationAreaStore.loading()
    }
  ]);

  readonly shortcuts = [
    {link: '/farms', icon: 'agd:farm', label: 'option.farm'},
    {link: '/parcels', icon: 'agd:parcel', label: 'option.parcel'},
    {link: '/crops', icon: 'agd:crop', label: 'option.crop'},
    {link: '/fumigation-areas', icon: 'agd:fumigation', label: 'option.fumigationArea'},
    {link: '/analytics', icon: 'agd:analytics', label: 'option.analytics'},
    {link: '/drones', icon: 'agd:drone', label: 'option.drone'}
  ];
}