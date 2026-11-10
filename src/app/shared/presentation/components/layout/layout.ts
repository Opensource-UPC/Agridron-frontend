import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {filter, map} from 'rxjs/operators';
import {HeaderContent} from '../header-content/header-content';
import {FooterContent} from '../footer-content/footer-content';
import {SideNav} from '../side-nav/side-nav';
import {AuthenticationService} from '../../../../iam/application/authentication.service';


@Component({
  imports: [HeaderContent, SideNav, FooterContent, RouterOutlet],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {
  /**
   * Indicates if there is an active session; the side navigation is only shown when signed in.
   */
  readonly isAuthenticated = inject(AuthenticationService).isAuthenticated;

  private readonly router = inject(Router);

  /**
   * Indicates if the current view is sign-in or sign-up, which render their own footer under the card.
   */
  readonly isAuthPage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.isAuthUrl(this.router.url))
    ),
    {initialValue: this.isAuthUrl(this.router.url)}
  );

  /**
   * Indicates if the side navigation is visible.
   */
  readonly sidebarOpen = signal(true);

  constructor() {
    // Up to 959 px the side navigation starts hidden; from 960 px it stays open.
    inject(BreakpointObserver)
      .observe('(max-width: 959px)')
      .pipe(takeUntilDestroyed())
      .subscribe(state => this.sidebarOpen.set(!state.matches));
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

  private isAuthUrl(url: string): boolean {
    return /^\/auth\/sign-(in|up)(\?|#|$)/.test(url) || url === '/' || url === '/auth';
  }
}
