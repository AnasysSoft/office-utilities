import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Icon } from '../../../shared/icon/icon';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Icon],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePasswordComponent {
	private _fb = inject(FormBuilder);
	private _location = inject(Location);
	private _toastService = inject(ToastService);

	passwordForm: FormGroup;
	isLoading = false;

	showCurrent = false;
	showNew = false;
	showConfirm = false;

	strength = 0;

	constructor() {
		this.passwordForm = this._fb.group({
		currentPassword: ['', [Validators.required]],
		newPassword: ['', [Validators.required, Validators.minLength(6)]],
		confirmPassword: ['', [Validators.required]]
		}, { validators: this.passwordMatchValidator });

		this.passwordForm.get('newPassword')?.valueChanges.subscribe(val => {
			this.calculateStrength(val);
		});
	}

	calculateStrength(password: string) {
		let score = 0;
		if (!password) {
			this.strength = 0;
			return;
		}
		if (password.length >= 6) score++;
		if (password.length >= 10) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[a-zA-Z]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;

		this.strength = Math.min(score, 4);
	}

	get newPasswordValue(): string {
		return this.passwordForm.get('newPassword')?.value || '';
	}

	get hasMinLength(): boolean {
		return this.newPasswordValue.length >= 6;
	}

	get hasNumber(): boolean {
		return /[0-9]/.test(this.newPasswordValue);
	}

	get hasLetter(): boolean {
		return /[a-zA-Z]/.test(this.newPasswordValue);
	}

	get strengthColor() {
		if (this.strength === 0) return 'bg-gray-200';
		if (this.strength <= 2) return 'bg-red-500';
		if (this.strength === 3) return 'bg-orange-500';
		return 'bg-green-500';
	}

	get strengthLabel() {
		if (this.strength === 0) return '';
		if (this.strength <= 2) return 'ضعیف';
		if (this.strength === 3) return 'متوسط';
		return 'قوی';
	}

	passwordMatchValidator(control: AbstractControl) {
		const newPass = control.get('newPassword')?.value;
		const confirmPass = control.get('confirmPassword')?.value;
		return newPass === confirmPass ? null : { mismatch: true };
	}

	onSubmit() {
		if (this.passwordForm.invalid) {
			this.passwordForm.markAllAsTouched();
			return;
		}

		this.isLoading = true;

		setTimeout(() => {
			this.isLoading = false;
			this._toastService.show('موفق', 'رمز عبور با موفقیت تغییر کرد.', 'success');
			this.goBack();
		}, 1500);
	}

	goBack() {
		this._location.back();
	}
}