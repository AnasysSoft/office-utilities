import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'meal-reservation-dashboard',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, Icon],
  templateUrl: './meal-reservation-dashboard.html',
  styleUrl: './meal-reservation-dashboard.scss',
})
export class MealReservationDashboard implements OnInit {
    private _router = inject(Router);
    private _activatedRoute = inject(ActivatedRoute);
    
    currentDate: string = '';

    ngOnInit(): void {
        this.calculateDate();
    }

    navigateTo(path: 'list' | 'guest') {
        this._router.navigate([path], { relativeTo: this._activatedRoute });
    }

    private calculateDate() {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        this.currentDate = new Intl.DateTimeFormat('fa-IR', options).format(new Date());
    }
}