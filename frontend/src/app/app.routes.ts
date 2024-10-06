import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./login-page/login-page.component')
        .then(m => m.LoginPageComponent)   
    },
    {
        path: 'multiStep',
        loadComponent: () => import('./multi-step-form/multi-step-form.component')
        .then(m => m.MultiStepFormComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./login-page/login-page.component')
        .then(m => m.LoginPageComponent)   
    },
];
