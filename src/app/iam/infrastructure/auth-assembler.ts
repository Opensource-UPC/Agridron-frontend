import { User } from '../domain/model/user.entity';
import { UserRole } from '../domain/model/user-role.enum';
import { AuthResponse } from './auth-response';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { SignInRequest } from './sign-in.request';
import { SignUpRequest } from './sign-up.request';

/**
 * Assembler to translate between API DTOs and domain entities/commands.
 */
export class AuthAssembler {
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