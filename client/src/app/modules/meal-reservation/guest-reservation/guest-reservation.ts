import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { baseForm } from '../../infrastructure/base-form';
import { MealService } from '../../../core/services/meal.service';
import { Icon } from '../../../shared/icon/icon';
import { PersianDatePickerComponent } from '../../../shared/persian-date-picker/persian-date-picker';

interface GuestDay {
  dateObj: Date;
  dateIso: string;
  dayName: string;
  dayNumber: string;
  monthName: string;
  fullDate: string;
  selectedFood?: string;
  quantity?: number;
}

@Component({
  selector: 'app-guest-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Icon, PersianDatePickerComponent],
  templateUrl: './guest-reservation.html',
  styleUrl: './guest-reservation.scss'
})
export class GuestReservation extends baseForm {
	private _mealService = inject(MealService);

	guestDays: GuestDay[] = [];
	showCalendar = false;

	override initialForm(): void {
		this.entityForm = this._formBuilder.group({
			fullName: [null, [Validators.required]],
			checkIn: [null, [Validators.required]],
			checkOut: [null, [Validators.required]],
		});

		this.validationMessages = {
			fullName: { required: 'وارد کردن نام میهمان اجباری است' },
			checkIn: { required: 'تاریخ ورود الزامی است' },
			checkOut: { required: 'تاریخ خروج الزامی است' },
		};
	}

	generateGuestCalendar() {
		if (this.entityForm.invalid) {
			this.entityForm.markAllAsTouched();
			return;
		}

		const { checkIn, checkOut } = this.entityForm.value;
		const startDate = new Date(checkIn);
		const endDate = new Date(checkOut);
		if (endDate < startDate) {
			alert('تاریخ خروج نمی‌تواند قبل از تاریخ ورود باشد!');
			return;
		}

		this.guestDays = [];
		const formatterDay = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' });
		const formatterNumber = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' });
		const formatterMonth = new Intl.DateTimeFormat('fa-IR', { month: 'long' });
		const formatterFull = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' });

		for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
		const dateIso = dt.toISOString().split('T')[0];
		
		const reserved = this._mealService.getReservation(dateIso);

		this.guestDays.push({
			dateObj: new Date(dt),
			dateIso: dateIso,
			dayName: formatterDay.format(dt),
			dayNumber: formatterNumber.format(dt),
			monthName: formatterMonth.format(dt),
			fullDate: formatterFull.format(dt),
			selectedFood: reserved?.selectedFoodName,
			quantity: reserved?.quantity
		});
		}

		this.showCalendar = true;
	}

	onSelectDay(day: GuestDay) {
		this._router.navigate(['/rsv/list'], {
			queryParams: { 
				date: day.dateIso, 
				persianDate: day.fullDate,
				guestName: this.entityForm.get('fullName')?.value
			}
		});
	}
}