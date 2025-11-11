import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadChildren: () => import('./modules/auth/auth-module').then(m => m.AuthModule) },
    { path: 'rsv', loadChildren: () => import('./modules/meal-reservation/meal-reservation-module').then(m => m.MealReservationModule) },
];
