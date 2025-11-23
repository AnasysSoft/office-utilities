import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import moment from 'jalali-moment';
import { JalaliDatePipe } from '../../../core/pipes/jalali-date';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/user/user-service';


type DayInfo = {
  isToday: boolean,
  date: Date;
  jalaliDate: string;
  day: string;      // نام روز به پارسی
  meal: string; // نام وعده غذایی (می‌تونی تغییر بدهی)
  canReserve: boolean,
  selectedMeals?: ({id: number, name: string})[]
};


@Component({
  selector: 'app-meal-selection',
  imports: [CommonModule, JalaliDatePipe],
  templateUrl: './meal-selection.html',
  styleUrl: './meal-selection.scss'
})
export class MealSelection {

  days: (DayInfo)[] = [];
  selectedDay: any;

  _activatedRoute = inject(ActivatedRoute);
  _router = inject(Router);
  _userService = inject(UserService);

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0)

    for (let index = 0; index < 20; index++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + index);

      const jMoment = moment(currentDate).locale('fa').format('D MMMM YYYY'); // برای محاسبه دقیق
      const dayName = moment(currentDate).locale('fa').format('dddd');

      // if(index != 3)
      this.days.push({ date: currentDate, jalaliDate: jMoment, day: dayName, meal: 'چلو کباب', isToday: index === 0, canReserve: index != 3 })
    }
  }

  selectItem(dayInfo: DayInfo) {
    this.selectedDay = dayInfo;

    this._router.navigate(['rsv/list'], {
       
      state: {
        day: dayInfo
      }
    });
  }


}


