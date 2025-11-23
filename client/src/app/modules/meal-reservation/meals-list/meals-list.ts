import { Component, inject, OnInit } from '@angular/core';
import { slideInAnimation } from '../../../core/animation/slide-animation';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/user/user-service';
import { JalaliDatePipe } from '../../../core/pipes/jalali-date';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meals-list',
  imports: [CommonModule, JalaliDatePipe],
  templateUrl: './meals-list.html',
  styleUrl: './meals-list.scss',
  animations: [slideInAnimation]
})
export class MealsList implements OnInit {
  selectedDay: any = null;
  selectedMealType?: number;
  mealTypes: (any)[] = [];
  items: (any)[] = [];

  _activatedRoute = inject(ActivatedRoute);
  _router = inject(Router);
  _userService = inject(UserService);


  ngOnInit(): void {
    if (history.state?.day) {
      this.selectedDay = history.state.day;
      console.log('کل اطلاعات روز:', this.selectedDay);
      // مثلاً: { date: ..., meal: 'زرشک‌پلو', isToday: true, ... }
    }


  }


  goBack() {
    this._router.navigate(['../'], { relativeTo: this._activatedRoute });
  }

  loadMealTypes() {
    this.mealTypes = [];
    this.mealTypes.push({ id: 1, name: 'ناهار' })
    this.mealTypes.push({ id: 2, name: 'دسر' })
    this.selectedMealType = 1;
  }

  loadMeals(mealType: any) {
    this.selectedMealType = mealType?.id;
    if (this.selectedMealType == 1) {
      this.items.push({ id: 1, name: 'ماست' });
      this.items.push({ id: 2, name: 'سالاد فصل' });
      this.items.push({ id: 3, name: 'سالاد کلم' });
      this.items.push({ id: 4, name: 'ماست موسیر' });
      this.items.push({ id: 5, name: 'سبزی' });
    }
    else if( this.selectedMealType == 2) {
      
      this.items.push({ id: 10, name: 'زرشک  پلو' });
      this.items.push({ id: 20, name: 'خوراک کباب' });
      this.items.push({ id: 30, name: 'کباب' });
      this.items.push({ id: 40, name: 'ماهی' });
      this.items.push({ id: 50, name: 'اکبر جوجه' });
    }
  }

  selectMeal() {

  }

  selectMeal2() {

  }

}


