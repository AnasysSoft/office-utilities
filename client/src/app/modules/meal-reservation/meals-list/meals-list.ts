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
  styleUrl: './meals-list.scss',
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
	quantity: number = 1;

	ngOnInit() {
		this._route.queryParams.subscribe((params) => {
		this.targetDate = params['date'];
		this.persianDateLabel = params['persianDate'];

		const existing = this._mealService.getReservation(this.targetDate);
			if (existing) {
				this.selectedMainId = existing.selectedFoodId || null;
				this.selectedSideId = existing.selectedSideId || null;
				this.quantity = existing.quantity || 1;
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

updateQuantity(delta: number) {
    const newQty = this.quantity + delta;
    if (newQty >= 1) {
      this.quantity = newQty;
    }
  }

  // تغییر تعداد با تایپ کردن
  // فقط عدد را تغییر می‌دهد، ذخیره نمی‌کند
  onQuantityInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = parseInt(input.value);

    if (isNaN(val) || val < 1) {
      val = 1;
    }
    if (val > 99) val = 99; // محدودیت نمایشی

    this.quantity = val;
  }

  // متد جدید: فقط وقتی دکمه ثبت زده شد اجرا می‌شود
  confirmSelection() {
    // بررسی اینکه آیا غذای اصلی انتخاب شده است؟
    if (!this.selectedMainId) {
        this._toastService.show('خطا', 'لطفاً ابتدا یک غذای اصلی انتخاب کنید.', 'warning');
        return;
    }

    this.saveReservation();
  }

  private saveReservation() {
    const mainName = this.mainCourses.find(m => m.id === this.selectedMainId)?.name || '';
    const sideName = this.sideDishes.find(s => s.id === this.selectedSideId)?.name || '';

    let displayName = mainName;
    if (sideName && sideName !== 'بدون نوشیدنی/دسر') {
      displayName += ` + ${sideName}`;
    }

    this._mealService.setReservation(
        this.targetDate, 
        displayName, 
        this.selectedMainId || 0, 
        this.selectedSideId, 
        this.quantity
    );
    
    this._toastService.show(
      'ثبت شد',
      `سفارش شما (${this.quantity} پرس) با موفقیت ذخیره شد.`,
      'success'
    );
    
    // اختیاری: بعد از ثبت برگردد عقب
    // setTimeout(() => this.goBack(), 1000); 
  }
}