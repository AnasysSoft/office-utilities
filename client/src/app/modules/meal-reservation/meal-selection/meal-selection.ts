import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../../../core/services/meal.service';
import { Icon } from '../../../shared/icon/icon';

interface CalendarDay {
	dateObj: Date;
	dateIso: string;
	dayName: string;
	dayNumber: string;
	monthName: string;
	fullDate: string;
	isHoliday: boolean;
	isPast: boolean;
	isToday: boolean;
	selectedFood?: string;
	quantity: number;
	isMenuSet?: boolean;
    mainCount?: number;
    sideCount?: number;
	isFinalized?: boolean;
	guestCount?: number;
}

interface WeekGroup {
	id: number;
	label: string;
	days: CalendarDay[];
}

@Component({
  selector: 'meal-selection',
  imports: [CommonModule, Icon],
  templateUrl: './meal-selection.html',
  styleUrl: './meal-selection.scss',
})
export class MealSelection implements OnInit {
	private _router = inject(Router);
	private _route = inject(ActivatedRoute);
	private _mealService = inject(MealService);

	weeks: WeekGroup[] = [];
	currentWeekIndex: number = 0;

	currentMode: 'user' | 'admin' | 'reservations' = 'user';

	private getLocalIsoDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

	ngOnInit() {
		this._route.queryParams.subscribe(params => {
            const mode = params['mode'];
            if (mode === 'admin') this.currentMode = 'admin';
            else if (mode === 'reservations') this.currentMode = 'reservations';
            else this.currentMode = 'user';
        });

		this.generateWeeks();
	}

	generateWeeks() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const formatterDay = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' });
		const formatterNumber = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' });
		const formatterMonth = new Intl.DateTimeFormat('fa-IR', { month: 'long' });
		const formatterDateLabel = new Intl.DateTimeFormat('fa-IR', { month: 'long', day: 'numeric' });
		const formatterFullDate = new Intl.DateTimeFormat('fa-IR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});

		const dayOfWeek = today.getDay();
		const offsetToSaturday = (dayOfWeek + 1) % 7;

		const startPointer = new Date(today);
		startPointer.setDate(today.getDate() - offsetToSaturday);

		for (let w = 0; w < 4; w++) {
			const weekDays: CalendarDay[] = [];
			const weekStart = new Date(startPointer);

			for (let d = 0; d < 7; d++) {
				const currentLoopDate = new Date(startPointer);
				currentLoopDate.setHours(0, 0, 0, 0);
				const isPast = currentLoopDate < today;
				const isToday = currentLoopDate.getTime() === today.getTime();

				const dateIso = this.getLocalIsoDate(startPointer);
				const isFriday = startPointer.getDay() === 5;

				const reserved = this._mealService.getReservation(dateIso);
                const guestCount = this._mealService.getGuestCountForDay(dateIso);
                const menuStatus = this._mealService.getDailyMenuStatus(dateIso);

				weekDays.push({
					dateObj: new Date(startPointer),
					dateIso: dateIso,
					dayName: formatterDay.format(startPointer),
					dayNumber: formatterNumber.format(startPointer),
					monthName: formatterMonth.format(startPointer),
					fullDate: formatterFullDate.format(startPointer),
					isHoliday: isFriday,
					isPast: isPast,
					isToday: isToday,
					selectedFood: reserved?.selectedFoodName,
					quantity: reserved?.quantity || 0,
					isMenuSet: menuStatus.isMenuSet,
					mainCount: menuStatus.mainCount,
            		sideCount: menuStatus.sideCount,
					isFinalized: menuStatus.isFinalized,
					guestCount: guestCount
				});

				startPointer.setDate(startPointer.getDate() + 1);
			}

			const weekEnd = new Date(startPointer);
			weekEnd.setDate(weekEnd.getDate() - 1);

			const label = `${formatterDateLabel.format(weekStart)}  -  ${formatterDateLabel.format(
				weekEnd
			)}`;

			this.weeks.push({
				id: w,
				label: label,
				days: weekDays,
			});
		}
	}

	onSelectDay(day: CalendarDay) {
        if (day.isHoliday || day.isPast) return;

        const queryParams = { date: day.dateIso, persianDate: day.fullDate };

        if (this.currentMode === 'admin') {
            this._router.navigate(['../admin/daily-menu'], { relativeTo: this._route, queryParams });
        
        } else if (this.currentMode === 'reservations') {
            this._router.navigate(['../admin/daily-reservations'], { relativeTo: this._route, queryParams });
        
        } else {
            this._router.navigate(['../list'], { relativeTo: this._route, queryParams });
        }
    }

	nextWeek() {
		if (this.currentWeekIndex < this.weeks.length - 1) {
			this.currentWeekIndex++;
		}
	}

	prevWeek() {
		if (this.currentWeekIndex > 0) {
			this.currentWeekIndex--;
		}
	}
}