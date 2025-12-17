import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-meal-reservation-dashboard',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, Icon, ButtonModule, FloatLabelModule, Checkbox, IftaLabelModule, InputTextModule, IconField, InputIcon],
  templateUrl: './meal-reservation-dashboard.html',
  styleUrl: './meal-reservation-dashboard.scss'
})
export class MealReservationDashboard {

  _router = inject(Router);
  _activatedRoute = inject(ActivatedRoute);
  activeTab: string  ='reserve';

  onTab(routeType: 'reserve' | 'guest') {
    this.activeTab = routeType;
    this._router.navigate([routeType], {relativeTo: this._activatedRoute});
  }

}
