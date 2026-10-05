/**
 * Command representing user input for logging
 */

export class SignInCommand {
    #username!: string;
    #password!: string;

    constructor(username: string, password: string) {
        this.#username = username;
        this.#password = password;
    }

    get username(): string {
        return this.#username;
    }
    get password(): string {
        return this.#password;
    }

    set username(value: string) {
        this.#username = value;
    }
    set password(value: string) {
        this.#password = value;
    }
}