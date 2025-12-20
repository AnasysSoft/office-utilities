import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, HostListener, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-persian-date-picker',
  standalone: true,
  imports: [CommonModule, Icon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersianDatePickerComponent),
      multi: true
    }
  ],
  templateUrl: './persian-date-picker.html',
  styleUrls: ['./persian-date-picker.scss']
})
export class PersianDatePickerComponent implements ControlValueAccessor {
	@Input() label: string = 'تاریخ';
	@Input() placeholder: string = 'انتخاب کنید';

	@Input() minDate: string | null = null;

	isOpen = signal(false);
	selectedDate: Date | null = null;
	displayValue: string = '';
	
	currentViewDate: Date = new Date();
	
	calendarDays: any[] = [];
	weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
	currentMonthName: string = '';
	currentYear: string = '';

	onChange: any = () => {};
	onTouch: any = () => {};

	constructor(private el: ElementRef) {
		this.generateCalendar();
	}

	toggle() {
		if (!this.isOpen()) {
			this.generateCalendar();
		}
		this.isOpen.set(!this.isOpen());
		this.onTouch();
	}

	@HostListener('document:click', ['$event'])
	onClickOutside(event: Event) {
		if (!this.el.nativeElement.contains(event.target)) {
		this.isOpen.set(false);
		}
	}

	selectDay(day: any) {
		if (!day.isCurrentMonth || day.isDisabled) return;
		
		this.selectedDate = day.dateObj;
		this.formatDisplay();
		this.onChange(this.selectedDate?.toISOString().split('T')[0]);
		this.isOpen.set(false);
	}

	changeMonth(step: number) {
		const newDate = new Date(this.currentViewDate);
		newDate.setDate(newDate.getDate() + (step * 30));
		this.currentViewDate = newDate;
		this.generateCalendar();
	}

	generateCalendar() {
		const today = new Date();
		const view = new Date(this.currentViewDate);
		
		const formatter = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long' });
		const parts = formatter.formatToParts(view);
		this.currentMonthName = parts.find(p => p.type === 'month')?.value || '';
		this.currentYear = parts.find(p => p.type === 'year')?.value || '';
		
		this.calendarDays = [];
		let pointer = new Date(view);
		const getJalaliDay = (d: Date) => parseInt(new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(d).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))));
		
		let safety = 0;
		while (getJalaliDay(pointer) > 1 && safety < 32) {
			pointer.setDate(pointer.getDate() - 1);
			safety++;
		}
		
		const weekDayOfFirst = (pointer.getDay() + 1) % 7;

		const startOffset = new Date(pointer);
		startOffset.setDate(startOffset.getDate() - weekDayOfFirst);

		for (let i = 0; i < 42; i++) {
			const d = new Date(startOffset);
			d.setDate(d.getDate() + i);
			
			const jDay = getJalaliDay(d);
			const mName = new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(d);
			const isCurrentMonth = mName === this.currentMonthName;
			
			const isSelected = this.selectedDate && d.getDate() === this.selectedDate.getDate() && d.getMonth() === this.selectedDate.getMonth();

			const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

			let isDisabled = false;
            if (this.minDate) {
                const min = new Date(this.minDate);
                min.setHours(0, 0, 0, 0);
                const current = new Date(d);
                current.setHours(0, 0, 0, 0);
                
                if (current < min) {
                    isDisabled = true;
                }
            }

			this.calendarDays.push({
				dateObj: d,
				dayNum: new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(d),
				isDisabled,
				isCurrentMonth,
				isSelected,
				isToday
			});
		}
	}

	formatDisplay() {
		if (!this.selectedDate) {
			this.displayValue = '';
			return;
		}

		this.displayValue = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(this.selectedDate);
	}

	writeValue(obj: any): void {
		if (obj) {
			this.selectedDate = new Date(obj);
			this.currentViewDate = new Date(obj);
			this.formatDisplay();
		}
	}
	registerOnChange(fn: any): void { this.onChange = fn; }
	registerOnTouched(fn: any): void { this.onTouch = fn; }
}