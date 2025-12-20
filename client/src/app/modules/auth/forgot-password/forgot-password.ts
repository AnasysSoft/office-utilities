import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { baseForm } from '../../infrastructure/base-form';
import { Icon } from '../../../shared/icon/icon';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Icon],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword extends baseForm {
	private _location = inject(Location);
	private _toastService = inject(ToastService);
	currentStep: 1 | 2 = 1;
	resetForm!: FormGroup;
  	passwordFieldType = 'password';
	confirmPasswordFieldType = 'password';

	override ngOnInit(): void {
		super.ngOnInit();
		this.resetForm = this._formBuilder.group({
			otpCode: [null, [Validators.required, Validators.minLength(4)]],
			newPassword: [null, [Validators.required, Validators.minLength(8)]],
			confirmPassword: [null, [Validators.required]]
		});
	}

	override initialForm(): void {
		this.entityForm = this._formBuilder.group({
			personnelCode: [null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]]
		});

		this.validationMessages = {
			personnelCode: {
				required: 'وارد کردن شماره پرسنلی اجباری است',
				pattern: 'شماره پرسنلی باید فقط عدد باشد',
				minlength: 'طول شماره پرسنلی ۶ رقم است',
				maxlength: 'طول شماره پرسنلی ۶ رقم است'
			},
			
			otpCode: { 
				required: 'کد تایید الزامی است',
				minlength: 'کد تایید باید حداقل ۴ رقم باشد'
			},
			newPassword: { 
				required: 'رمز عبور جدید الزامی است', 
				minlength: 'حداقل ۸ کاراکتر' 
			},
			confirmPassword: {
				required: 'تکرار رمز عبور الزامی است'
			}
		};
	}

	submitRecovery() {
		if (this.entityForm.invalid) {
			this.entityForm.markAllAsTouched();
		return;
		}

		const code = this.entityForm.get('personnelCode')?.value;
		console.log('Sending OTP to:', code);

		this._toastService.show('کد ارسال شد', 'کد تایید به موبایل شما ارسال شد.', 'info', 3000);
		
		this.currentStep = 2;
	}

	submitResetPassword() {
		if (this.resetForm.invalid) {
			this.resetForm.markAllAsTouched();
			return;
		}

		const { otpCode, newPassword, confirmPassword } = this.resetForm.value;

		if (newPassword !== confirmPassword) {
			this._toastService.show('خطا', 'تکرار رمز عبور مطابقت ندارد.', 'warning');
			return;
		}

		console.log('Resetting password with OTP:', otpCode);
		

		this._toastService.show('موفق', 'رمز عبور با موفقیت تغییر کرد.', 'success');
		
		setTimeout(() => {
			this._router.navigate(['/']);
		}, 1500);
	}

	goBack() {
		if (this.currentStep === 2) {
			this.currentStep = 1;
		} else {
			this._location.back();
		}
	}

	togglePasswordVisibility() {
		this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
	}

	toggleConfirmPasswordVisibility() {
        this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
}