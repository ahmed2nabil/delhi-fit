import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import('./login-page/login-page.component')
        .then(m => m.LoginPageComponent)
    },
    {
        path: 'multiStep/:trainerId',
        loadComponent: () => import('./multi-step-form/multi-step-form.component')
        .then(m => m.MultiStepFormComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./login-page/login-page.component')
        .then(m => m.LoginPageComponent)
    },
    {
        path: "admin",
        loadComponent: () => import('./admin-dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent),
        canActivate: [AuthGuard]      
    }, 
    {
        path: "**",
        loadComponent: () => import('./login-page/login-page.component')
        .then(m => m.LoginPageComponent)   
    }
];
