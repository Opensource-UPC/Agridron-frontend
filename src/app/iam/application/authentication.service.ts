import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../domain/model/user.entity';
import { UserRole } from '../domain/model/user-role.enum';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { AuthApi } from '../infrastructure/auth-api';
import { AuthAssembler } from '../infrastructure/auth-assembler';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly authApi = inject(AuthApi);
    private readonly router = inject(Router);

    // Private reactive signals
    #currentUser = signal<User | null>(null);
    #token = signal<string | null>(localStorage.getItem('token'));
    #loading = signal<boolean>(false);
    #error = signal<string | null>(null);

    // Readonly public signals
    readonly currentUser = this.#currentUser.asReadonly();
    readonly token = this.#token.asReadonly();
    readonly isAuthenticated = computed(() => this.#currentUser() !== null || this.#token() !== null);
    readonly currentRole = computed(() => this.#currentUser()?.role ?? null);
    readonly loading = this.#loading.asReadonly();
    readonly error = this.#error.asReadonly();

    /**
     * Handles signing in a user.
     */
    signIn(command: SignInCommand): void {
        this.#loading.set(true);
        this.#error.set(null);

        const request = AuthAssembler.toSignInRequestFromCommand(command);

        this.authApi.signIn(request).subscribe({
            next: (response) => {
                const user = AuthAssembler.toEntityFromResponse(response);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    this.#token.set(response.token);
                }
                this.#currentUser.set(user);
                this.#loading.set(false);
                this.router.navigate(['/farms']);
            },
            error: (err) => {
                this.#error.set(err?.error?.message ?? 'Credenciales inválidas');
                this.#loading.set(false);
            }
        });
    }

    /**
     * Handles signing up a user.
     */
    signUp(command: SignUpCommand): void {
        this.#loading.set(true);
        this.#error.set(null);

        const request = AuthAssembler.toSignUpRequestFromCommand(command);

        this.authApi.signUp(request).subscribe({
            next: (response) => {
                const user = AuthAssembler.toEntityFromResponse(response);
                user.signUp();
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    this.#token.set(response.token);
                }
                this.#currentUser.set(user);
                this.#loading.set(false);
                this.router.navigate(['/farms']);
            },
            error: (err) => {
                this.#error.set(err?.error?.message ?? 'Error al registrar usuario');
                this.#loading.set(false);
            }
        });
    }

    /**
     * Clears session and logs out user.
     */
    signOut(): void {
        localStorage.removeItem('token');
        this.#currentUser.set(null);
        this.#token.set(null);
        this.router.navigate(['/auth/sign-in']);
    }

    /**
     * Validates if user has the required role.
     */
    hasAccess(user: User | null, requiredRole: UserRole): boolean {
        if (!user) return false;
        return user.hasRole(requiredRole);
    }
}