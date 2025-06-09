import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { Dashboard } from './app/pages/dashboard/dashboard.component';
import { AuthUser } from './app/pages/auth-user/auth-user.component';
import { selectedUserGuard } from './app/guards/selected-user.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [selectedUserGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'dashboard', component: Dashboard},
            { path: 'management', loadChildren: () => import('./app/pages/management/management.routes').then(e => e.routes) }
        ]
    },
    { path: 'auth-user', component: AuthUser},
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
