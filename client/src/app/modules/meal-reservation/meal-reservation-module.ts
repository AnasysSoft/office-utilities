import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealReservationDashboard } from './meal-reservation-dashboard/meal-reservation-dashboard';
import { Routes, RouterModule } from '@angular/router';
import { MealSelection } from './meal-selection/meal-selection';
import { MealsList } from './meals-list/meals-list';
import { GuestReservation } from './guest-reservation/guest-reservation';
import { DailyMenuManagement } from '../admin/daily-menu-management/daily-menu-management';
import { DailyReservationsList } from '../admin/daily-reservations-list/daily-reservations-list';
import { UserProfile } from '../features/user-profile/user-profile';
import { FoodManagement } from '../admin/food-management/food-management';
import { NotFoundComponent } from '../features/not-found/not-found';

const routes: Routes = [
  {path: '', component: MealReservationDashboard, 
    children: [
        {path: 'reserve', component: MealSelection},
        {path: 'guest', component: GuestReservation},
        {path: 'list', component: MealsList},
        { path: 'admin/daily-menu', component: DailyMenuManagement },
        { path: 'admin/daily-reservations', component: DailyReservationsList },
        { path: 'admin/foods', component: FoodManagement },
        {path: 'profile', component: UserProfile},
        { path: '**', component: NotFoundComponent }
    ]}, 
   // {path: 'list', component: MealsList} 
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class MealReservationModule { }
