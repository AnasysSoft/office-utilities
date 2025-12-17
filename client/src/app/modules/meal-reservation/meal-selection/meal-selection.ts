import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MealService } from '../../../core/services/meal.service';
import { Icon } from '../../../shared/icon/icon';

interface CalendarDay {
	dateObj: Date;
	dateIso: string;
	dayName: string;
	fullDate: string;
	isHoliday: boolean;
	selectedFood?: string;
}

@Component({
  selector: 'meal-selection',
  imports: [CommonModule, Icon],
  templateUrl: './meal-selection.html',
  styleUrl: './meal-selection.scss',
})
export class MealSelection {
	private _router = inject(Router);
	private _mealService = inject(MealService);

	days: CalendarDay[] = [];

	ngOnInit() {
		this.generateDays();
	}

	generateDays() {
		const today = new Date();
		const formatterDay = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' });
		const formatterDate = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' });

		for (let i = 0; i < 20; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);

			const dateIso = date.toISOString().split('T')[0];
			
			const reserved = this._mealService.getReservation(dateIso);

			const isFriday = date.getDay() === 5; 

			this.days.push({
				dateObj: date,
				dateIso: dateIso,
				dayName: formatterDay.format(date),
				fullDate: formatterDate.format(date),
				isHoliday: isFriday,
				selectedFood: reserved?.selectedFoodName
			});
		}
	}

	onSelectDay(day: CalendarDay) {
		if (day.isHoliday) return;

		this._router.navigate(['/rsv/list'], { 
			queryParams: { 
				date: day.dateIso, 
				persianDate: day.fullDate 
			} 
		});
	}
}