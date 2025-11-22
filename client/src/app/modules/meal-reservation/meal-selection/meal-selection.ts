import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
};


@Component({
  selector: 'app-meal-selection',
  imports: [CommonModule,  JalaliDatePipe],
  templateUrl: './meal-selection.html',
  styleUrl: './meal-selection.scss'
})
export class MealSelection {

  days: (DayInfo)[] = [];
   
  constructor(  
        private _userService: UserService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router){
    const today = new Date();
    today.setHours(0, 0, 0, 0)

    for (let index = 0; index < 10; index++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + index);

      const jMoment = moment(currentDate).locale('fa').format('D MMMM YYYY'); // برای محاسبه دقیق
      const dayName = moment(currentDate).locale('fa').format('dddd');
      
      if(index != 3)
      this.days.push({date: currentDate, jalaliDate: jMoment, day: dayName, meal: 'چلو کباب', isToday: index === 0})
    }
  }

  selectItem(dayInfo: DayInfo) {
    this._router.navigate(['./rsv/list']);
  }


}


