/**
 * Resource representation of a user stored in the API.
 */
export interface UserResource {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}