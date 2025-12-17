import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Icon } from '../../../shared/icon/icon';
import { MealService, UserDailyReservation } from '../../../core/services/meal.service';

@Component({
  selector: 'app-daily-reservations-list',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './daily-reservations-list.html',
  styleUrl: './daily-reservations-list.scss'
})
export class DailyReservationsList implements OnInit {
	private _route = inject(ActivatedRoute);
	private _location = inject(Location);
	private _mealService = inject(MealService);

	targetDate: string = '';
	persianDateLabel: string = '';
	reservations: UserDailyReservation[] = [];

	ngOnInit() {
		this._route.queryParams.subscribe(params => {
		this.targetDate = params['date'];
		this.persianDateLabel = params['persianDate'];
		this.loadData();
		});
	}

	loadData() {
		this.reservations = this._mealService.getDailyUserReservations(this.targetDate);
	}

	goBack() {
		this._location.back();
	}

	toggleApproval(res: UserDailyReservation) {
		this._mealService.toggleReservationApproval(this.targetDate, res.id);
		this.loadData();
	}
}