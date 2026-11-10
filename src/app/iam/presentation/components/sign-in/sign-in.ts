import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterContent } from '../../../../shared/presentation/components/footer-content/footer-content';
import { AuthenticationService } from '../../../application/authentication.service';
import { SignInCommand } from '../../../domain/model/sign-in.command';

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    FooterContent
  ],
  templateUrl: './sign-in.html',
  styleUrl: '../auth-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignIn {
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthenticationService);

  hidePassword = true;

  readonly form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    if (username && password) {
      const command = new SignInCommand(username, password);
      this.authService.signIn(command);
    }
  }
}
