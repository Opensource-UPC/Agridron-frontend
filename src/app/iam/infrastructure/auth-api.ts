import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from './auth-response';
import { SignInRequest } from './sign-in.request';
import { SignUpRequest } from './sign-up.request';

@Injectable({
    providedIn: 'root'
})
export class AuthApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8080/api/v1/authentication';

    signIn(request: SignInRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/sign-in`, request);
    }

    signUp(request: SignUpRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/sign-up`, request);
    }
}