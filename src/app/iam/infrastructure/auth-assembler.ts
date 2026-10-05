import {Observable, of, throwError} from 'rxjs';
import {User} from '../domain/model/user.entity';
import {UserRole} from '../domain/model/user-role.enum';
import {AuthResponse} from './auth-response';
import {SignInCommand} from '../domain/model/sign-in.command';
import {SignUpCommand} from '../domain/model/sign-up.command';
import {AuthApi} from './auth-api';
import {UserResource} from './user-resource';
import {SignInRequest} from './sign-in.request';
import {SignUpRequest} from './sign-up.request';

/**
 * Assembler to translate between API DTOs and domain entities/commands.
 */
export class AuthAssembler {
    /**
     * Converts a user resource into an AuthResponse, verifying the credentials.
     * @param users - The stored user collection.
     * @param request - The credentials to verify.
     * @returns Stream with the authenticated session or a failure.
     */
    static toSessionFromCredentials(users: UserResource[], request: SignInRequest): Observable<AuthResponse> {
        const match = users.find(user => user.username === request.username && user.password === request.password);

        if (!match) {
            return throwError(() => new Error('Credenciales inválidas'));
        }

        return of({
            id: match.id,
            username: match.username,
            email: match.email,
            role: match.role,
            token: `mock-token-${match.id}-${match.username}`
        });
    }

    /**
     * Converts a user resource into a session response.
     * @param resource - The created user resource.
     * @returns Stream with the new session.
     */
    static toSessionFromResource(resource: UserResource): Observable<AuthResponse> {
        return of({
            id: resource.id,
            username: resource.username,
            email: resource.email,
            role: resource.role,
            token: `mock-token-${resource.id}-${resource.username}`
        });
    }

    static toEntityFromResponse(response: AuthResponse): User {
        const role = (response.role in UserRole)
            ? (response.role as UserRole)
            : UserRole.FARMER;

        return new User(
            response.id,
            response.username,
            response.email,
            '',
            role
        );
    }

    static toSignInRequestFromCommand(command: SignInCommand): SignInRequest {
        return {
            username: command.username,
            password: command.password
        };
    }

    static toSignUpRequestFromCommand(command: SignUpCommand): SignUpRequest {
        return {
            username: command.username,
            email: command.email,
            password: command.password,
            role: command.role
        };
    }
}