import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'multiStep',
        loadComponent: () => import('./multi-step-form/multi-step-form.component')
        .then(m => m.MultiStepFormComponent)
    },
];
