import { Routes } from '@angular/router';

export const iamRoutes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
    },
    {
        path: 'sign-in',
        loadComponent: () =>
            import('./components/sign-in/sign-in').then(m => m.SignIn)
    },
    {
        path: 'sign-up',
        loadComponent: () =>
            import('./components/sign-up/sign-up').then(m => m.SignUp)
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./components/user-profile/user-profile').then(m => m.UserProfile)
    }
];