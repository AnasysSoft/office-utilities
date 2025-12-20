import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Icon],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile implements OnInit {
	private _fb = inject(FormBuilder);
	private _location = inject(Location);
	private _toastService = inject(ToastService);

	profileForm!: FormGroup;
	selectedFile: string | null = null;

	ngOnInit() {
		this.initForm();
	}

	private initForm() {
		this.profileForm = this._fb.group({
			fullName: ['علی محمدی', [Validators.required, Validators.minLength(3)]],
			personnelCode: [{ value: '123456', disabled: true }],
			phoneNumber: ['09123456789', [Validators.required, Validators.pattern('^09[0-9]{9}$')]],
			email: ['ali.mohammadi@example.com', [Validators.required, Validators.email]],
		});
	}

	onFileSelected(event: any) {
		const file = event.target.files[0];
		if (file) {
			this._toastService.show('تصویر', 'تصویر انتخاب شد (دمو)', 'info');
		}
	}

	saveProfile() {
		if (this.profileForm.invalid) {
			this.profileForm.markAllAsTouched();
			this._toastService.show('خطا', 'لطفاً اطلاعات را به درستی وارد کنید.', 'error');
			return;
		}

		console.log('Profile Data:', this.profileForm.getRawValue());
		
		this._toastService.show('موفق', 'تغییرات پروفایل با موفقیت ذخیره شد.', 'success');
		
		// this._location.back();
	}

	goBack() {
		this._location.back();
	}
}