import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthenticationService } from '../../../application/authentication.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ,
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

  onSignOut(): void {
    this.authService.signOut();
  }
}
