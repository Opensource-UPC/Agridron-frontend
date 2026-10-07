import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderContent} from '../header-content/header-content';
import {FooterContent} from '../footer-content/footer-content';
import {SideNav} from '../side-nav/side-nav';


@Component({
  imports: [HeaderContent, SideNav, FooterContent, RouterOutlet],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {
  /**
   * Indicates if the side navigation is visible.
   */
  readonly sidebarOpen = signal(true);

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