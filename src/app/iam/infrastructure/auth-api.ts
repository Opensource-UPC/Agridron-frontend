import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserResource} from './user-resource';
import {SignUpRequest} from './sign-up.request';

@Injectable({
    providedIn: 'root'
})
export class AuthApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderUsersEndpointPath}`;

    /**
     * Retrieves all registered users.
     * @returns Stream with the user collection.
     */
    getUsers(): Observable<UserResource[]> {
        return this.http.get<UserResource[]>(this.baseUrl);
    }

    /**
     * Registers a new user.
     * @param request - The user data to persist.
     * @returns Stream with the created user.
     */
    signUp(request: SignUpRequest): Observable<UserResource> {
        return this.http.post<UserResource>(this.baseUrl, request);
    }
}