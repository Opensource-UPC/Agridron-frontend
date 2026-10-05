import { UserRole} from "./user-role.enum";
import {email} from "@angular/forms/signals";

/**
 * Command representing user input for registration
 */

export class SignUpCommand {
    #username!: string;
    #email!: string;
    #password!: string;
    #role!: UserRole;

    constructor(username: string, email: string, password: string, role: UserRole) {
        this.#username = username;
        this.#email = email;
        this.#password = password;
        this.#role = role;
    }


    get username(): string {
        return this.#username;
    }

    set username(value: string) {
        this.#username = value;
    }

    get email(): string {
        return this.#email;
    }

    set email(value: string) {
        this.#email = value;
    }

    get password(): string {
        return this.#password;
    }

    set password(value: string) {
        this.#password = value;
    }

    get role(): UserRole {
        return this.#role;
    }

    set role(value: UserRole) {
        this.#role = value;
    }
}