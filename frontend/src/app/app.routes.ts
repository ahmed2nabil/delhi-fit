import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home-page/home-page.component')
        .then(m => m.HomePageComponent)   
    },
    {
        path: 'multiStep',
        loadComponent: () => import('./multi-step-form/multi-step-form.component')
        .then(m => m.MultiStepFormComponent)
    },
];
