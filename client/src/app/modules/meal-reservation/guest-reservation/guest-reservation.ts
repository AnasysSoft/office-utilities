import { Component } from '@angular/core';
import { baseForm } from '../../infrastructure/base-form';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-guest-reservation',
  imports: [CommonModule, ReactiveFormsModule, Icon, ButtonModule, FloatLabelModule, Checkbox, IftaLabelModule, InputTextModule, IconField, InputIcon],
  templateUrl: './guest-reservation.html',
  styleUrl: './guest-reservation.scss'
})
export class GuestReservation extends baseForm {

  override initialForm(): void {
    this.entityForm = this._formBuilder.group({
			fullName: [null, [Validators.required]],
			date:[null, [Validators.required]],
			selectedMealIds:[null]
		});

    this.validationMessages = {
			fullName: {
				required: 'وارد کردن نام میهمان اجباری است', 
			},
			date: {
				required: 'وارد کردن تاریخ رزرو اجباری است', 
			}
		};

  }

  guestRezerve() {
    
  }
  
}
