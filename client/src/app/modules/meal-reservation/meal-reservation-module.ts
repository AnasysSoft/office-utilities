import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealReservationDashboard } from './meal-reservation-dashboard/meal-reservation-dashboard';
import { Routes, RouterModule } from '@angular/router';
import { MealSelection } from './meal-selection/meal-selection';
import { MealsList } from './meals-list/meals-list';
import { GuestReservation } from './guest-reservation/guest-reservation';

const routes: Routes = [
  {path: '', component: MealReservationDashboard, 
    children: [
        {path: 'reserve', component: MealSelection},
        {path: 'guest', component: GuestReservation},
        {path: 'list', component: MealsList},
        {path: '**', component: MealSelection},
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
