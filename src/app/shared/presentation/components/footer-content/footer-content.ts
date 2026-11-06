import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [TranslatePipe],
  selector: 'app-footer-content',
  styleUrl: './footer-content.css',
  templateUrl: './footer-content.html',
})
export class FooterContent {
  /**
   * `bar`: full-width green footer of the app layout.
   * `inline`: transparent footer placed under the sign-in / sign-up card.
   */
  readonly variant = input<'bar' | 'inline'>('bar');
}
