import { UserRole} from "./user-role.enum";
import {email} from "@angular/forms/signals";

/**
 * User domain entity representing an authenticated user.
 */

export class User {
    #id!: number | null;
    #username!: string;
    #email!: string;
    #password!: string;
    #role!: UserRole;

    constructor(id: number | null, username: string, email: string ,password: string, role: UserRole) {
        this.#id = id;
        this.#username = username;
        this.#email = email;
        this.#password = password;
        this.#role = role;
    }


    get id(): number | null {
        return this.#id;
    }

    set id(value: number | null) {
        this.#id = value;
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

    /**
     * Domain behavior methods from class diagram
     */
    signUp():void{

    }

    authenticate():boolean {
    return this.#id !== null && this.#username.length > 0 && this.#password.length > 0;
    }

    updateProfile(username?: string, email?: string, password?: string):void{
        if (username) this.#username = username;
        if (email) this.#email = email;
    }

    hasRole(role: UserRole):boolean{
        return this.#role === role;
    }
}