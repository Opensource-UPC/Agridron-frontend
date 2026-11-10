import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthenticationService } from '../../../application/authentication.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfile {
  readonly authService = inject(AuthenticationService);

  readonly user = this.authService.currentUser;
  readonly role = this.authService.currentRole;
  readonly isAuthenticated = this.authService.isAuthenticated;

  /** First letter of the username, shown in the avatar. */
  readonly initial = computed(() => this.user()?.username?.charAt(0).toUpperCase() ?? '');

  onSignOut(): void {
    this.authService.signOut();
  }
}
