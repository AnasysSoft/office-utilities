import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { baseForm } from '../../infrastructure/base-form';

@Component({
	selector: 'app-signin',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './signin.html',
	styleUrl: './signin.scss'
})
export class Signin extends baseForm {
	passwordFieldType: string = 'password';

	override ngOnInit(): void {
		super.ngOnInit();
	}

	override initialForm(): void {
		this.entityForm = this._formBuilder.group({
			personnelCode: [null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]],
			password: [null, [Validators.required, Validators.minLength(8)]],
			isHuman: [null]
		});

		this.validationMessages = {
			personnelCode: {
				required: 'وارد کردن شماره پرسنلی اجباری است',
				pattern: 'شماره پرسنلی باید ترکیبی از اعداد باشد',
				minlength: 'طول شماره پرسنلی 6 رقم می باشد',
				maxlength: 'طول شماره پرسنلی 6 رقم می باشد'
			},
			password: {
				required: 'وارد کردن پسور اجباری است',
				minlength: 'حد اقل طول پسورد 8 کاراکتر می باشد',
			}
		};

	}

	login() {
		this._router.navigate(['/rsv/reserve']);
	}

	togglePasswordVisibility() {
		this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
	}
}
