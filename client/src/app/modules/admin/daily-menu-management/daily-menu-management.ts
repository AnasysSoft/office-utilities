import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Icon } from '../../../shared/icon/icon';
import { MealService } from '../../../core/services/meal.service'; 

interface FoodItem {
  id: number;
  name: string;
  type: 'main' | 'side';
  isActive: boolean;
}

@Component({
  selector: 'app-daily-menu-management',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './daily-menu-management.html',
  styleUrl: './daily-menu-management.scss'
})
export class DailyMenuManagement implements OnInit {
  	private _route = inject(ActivatedRoute);
	private _location = inject(Location);
	private _mealService = inject(MealService);

	targetDate: string = '';
	persianDateLabel: string = '';

	allFoods: FoodItem[] = [
		{ id: 1, name: 'چلو کباب کوبیده', type: 'main', isActive: false },
		{ id: 2, name: 'زرشک پلو با مرغ', type: 'main', isActive: false },
		{ id: 3, name: 'قورمه سبزی', type: 'main', isActive: false },
		{ id: 4, name: 'خوراک شنیسل', type: 'main', isActive: false },
		{ id: 101, name: 'نوشابه', type: 'side', isActive: false },
		{ id: 102, name: 'دوغ', type: 'side', isActive: false },
	];

	ngOnInit() {
		this._route.queryParams.subscribe(params => {
			this.targetDate = params['date'];
			this.persianDateLabel = params['persianDate'];
		});
	}

	goBack() {
		this._location.back();
	}

	toggleFood(food: FoodItem) {
		food.isActive = !food.isActive;
	}

	saveDailyMenu() {
		const mainCount = this.allFoods.filter(f => f.isActive && f.type === 'main').length;
		
		const sideCount = this.allFoods.filter(f => f.isActive && f.type === 'side').length;
		
		console.log(mainCount, sideCount);
		
		this._mealService.setDailyMenuStatus(this.targetDate, mainCount, sideCount);
		
		this.goBack();
	}
}