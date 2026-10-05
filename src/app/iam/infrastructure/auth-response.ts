export interface AuthResponse {
    id: number;
    username: string;
    email: string;
    role: string;
    token?: string;
}