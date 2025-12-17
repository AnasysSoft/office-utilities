import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealService } from '../../../core/services/meal.service';
import { ToastService } from '../../../core/services/toast.service';
import { Icon } from '../../../shared/icon/icon';

interface SimpleMeal {
	id: number;
	name: string;
	type: 'main' | 'side';
}

@Component({
  selector: 'app-meals-list',
  imports: [CommonModule, Icon],
  templateUrl: './meals-list.html',
  styleUrl: './meals-list.scss'
})
export class MealsList implements OnInit {
	private _route = inject(ActivatedRoute);
	private _location = inject(Location);
	private _mealService = inject(MealService);
	public _toastService = inject(ToastService);

	targetDate: string = '';
	persianDateLabel: string = '';

	mainCourses: SimpleMeal[] = [
		{ id: 1, name: 'چلو کباب کوبیده زعفرانی', type: 'main' },
		{ id: 2, name: 'زرشک پلو با مرغ مجلسی', type: 'main' },
		{ id: 3, name: 'خورشت قورمه سبزی', type: 'main' },
		{ id: 4, name: 'خوراک شنیسل مرغ', type: 'main' },
		{ id: 5, name: 'خوراک سبزیجات رژیمی', type: 'main' },
	];

	sideDishes: SimpleMeal[] = [
		{ id: 101, name: 'نوشابه قوطی', type: 'side' },
		{ id: 102, name: 'دوغ محلی', type: 'side' },
		{ id: 103, name: 'ماست موسیر', type: 'side' },
		{ id: 104, name: 'ژله میوه‌ای', type: 'side' },
		{ id: 105, name: 'بدون نوشیدنی/دسر', type: 'side' },
	];

	selectedMainId: number | null = null;
	selectedSideId: number | null = null;

	ngOnInit() {
		this._route.queryParams.subscribe(params => {
			this.targetDate = params['date'];
			this.persianDateLabel = params['persianDate'];
			const existing = this._mealService.getReservation(this.targetDate);
			if (existing && existing.selectedFoodId) {
			}
		});
	}

	goBack() {
		this._location.back();
	}

	selectMain(meal: SimpleMeal) {
		this.selectedMainId = meal.id;
		this.saveReservation();
	}

	selectSide(meal: SimpleMeal) {
		this.selectedSideId = meal.id;
		this.saveReservation();
	}

	private saveReservation() {
		const mainName = this.mainCourses.find(m => m.id === this.selectedMainId)?.name || '';
		const sideName = this.sideDishes.find(s => s.id === this.selectedSideId)?.name || '';

		let displayName = mainName;
		if (sideName && sideName !== 'بدون نوشیدنی/دسر') {
			displayName += ` + ${sideName}`;
		}

		this._mealService.setReservation(this.targetDate, displayName, this.selectedMainId || 0);
		
		this._toastService.show(
			'عملیات موفق',
			'انتخاب‌های شما با موفقیت در سیستم ثبت شد.',
			'success'
		);
	}
}