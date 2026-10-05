import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthenticationService } from '../../../application/authentication.service';
import { SignUpCommand } from '../../../domain/model/sign-up.command';
import { UserRole } from '../../../domain/model/user-role.enum';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUp {
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthenticationService);

  hidePassword = true;

  readonly roles = [
    { value: UserRole.FARMER, label: 'Agricultor (Farmer)' },
    { value: UserRole.OPERATOR, label: 'Operador de Dron (Operator)' },
    { value: UserRole.TECHNICIAN, label: 'Técnico Agrícola (Technician)' }
  ];

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.FARMER, [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, email, password, role } = this.form.getRawValue();
    if (username && email && password && role) {
      const command = new SignUpCommand(username, email, password, role);
      this.authService.signUp(command);
    }
  }
}
