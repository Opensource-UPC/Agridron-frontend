import {Injectable, inject, signal, computed} from '@angular/core';
import {Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {User} from '../domain/model/user.entity';
import {UserRole} from '../domain/model/user-role.enum';
import {SignInCommand} from '../domain/model/sign-in.command';
import {SignUpCommand} from '../domain/model/sign-up.command';
import {AuthApi} from '../infrastructure/auth-api';
import {AuthAssembler} from '../infrastructure/auth-assembler';

/**
 * Shape persisted in localStorage to survive page reloads.
 * The password is never stored.
 */
interface StoredUser {
    id: number | null;
    username: string;
    email: string;
    role: UserRole;
}

/**
 * Restores the current user from localStorage, ignoring malformed entries.
 * @returns The stored user or null when there is no valid session.
 */
function readStoredUser(): User | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;

    try {
        const stored = JSON.parse(raw) as StoredUser;
        if (!stored.username) return null;
        return new User(stored.id, stored.username, stored.email, '', stored.role);
    } catch {
        localStorage.removeItem('user');
        return null;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly authApi = inject(AuthApi);
    private readonly router = inject(Router);

    // Private reactive signals
    #currentUser = signal<User | null>(readStoredUser());
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
     * Persists the active session so it survives a page reload.
     * @param user - The authenticated user.
     * @param token - The session token.
     */
    private storeSession(user: User, token: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        } satisfies StoredUser));
        this.#token.set(token);
        this.#currentUser.set(user);
    }

    /**
     * Removes the persisted session.
     */
    private clearSession(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.#token.set(null);
        this.#currentUser.set(null);
    }

    /**
     * Handles signing in a user.
     */
    signIn(command: SignInCommand): void {
        this.#loading.set(true);
        this.#error.set(null);

        const request = AuthAssembler.toSignInRequestFromCommand(command);

        this.authApi.getUsers().pipe(
            switchMap(users => AuthAssembler.toSessionFromCredentials(users, request))
        ).subscribe({
            next: (response) => {
                const user = AuthAssembler.toEntityFromResponse(response);
                if (response.token) {
                    this.storeSession(user, response.token);
                }
                this.#loading.set(false);
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.#error.set(err?.message ?? 'Credenciales inválidas');
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

        this.authApi.signUp(request).pipe(
            switchMap(created => AuthAssembler.toSessionFromResource(created))
        ).subscribe({
            next: (response) => {
                const user = AuthAssembler.toEntityFromResponse(response);
                user.signUp();
                if (response.token) {
                    this.storeSession(user, response.token);
                }
                this.#loading.set(false);
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.#error.set(err?.message ?? 'Error al registrar usuario');
                this.#loading.set(false);
            }
        });
    }

    /**
     * Clears session and logs out user.
     */
    signOut(): void {
        this.clearSession();
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