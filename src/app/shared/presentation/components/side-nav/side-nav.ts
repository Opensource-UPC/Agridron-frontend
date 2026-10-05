import {ChangeDetectionStrategy, Component, computed, inject, input, InputSignal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Side navigation menu for the main application sections.
 */
@Component({
  selector: 'app-side-nav',
  imports: [MatSidenavModule, MatListModule, MatIconModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNav {
  readonly open = input.required<boolean>();

  readonly close = input.required<() => void>();

  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 959px)').pipe(map(state => state.matches)),
    {initialValue: false}
  );

  readonly mode = computed(() => (this.isMobile() ? 'over' : 'side'));

  readonly opened = computed(() => (this.isMobile() ? this.open() : true));

  readonly options = [
    {link: '/home', label: 'option.home', icon: 'home'},
    {link: '/farms', label: 'option.farm', icon: 'agriculture'},
    {link: '/parcels', label: 'option.parcel', icon: 'grid_view'},
    {link: '/crops', label: 'option.crop', icon: 'grass'},
    {link: '/fumigation-areas', label: 'option.fumigationArea', icon: 'science'},
    {link: '/analytics', label: 'option.analytics', icon: 'insights'},
    {link: '/drones', label: 'option.drone', icon: 'Drone'},
    {link: '/auth/profile', label: 'option.profile', icon: 'person'}
  ];

  onNavigate = (): void => {
    if (this.isMobile()) {
      this.close()();
    }
  };
}