import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "../../core/user/user-service";
import { Router } from "@angular/router";
import { ChildActionService, MethodName } from "./child-action-service";
import { Subscription } from "rxjs";


@Component({
	selector: '',
	template: '<div>base</div>',
	imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class baseForm implements OnInit, OnDestroy {
	protected entityForm!: FormGroup;
	private sub?: Subscription;
	formErrors: any = {};
	validationMessages: any;

	_router = inject(Router);
	_changeDetectorRef = inject(ChangeDetectorRef);
	_userService = inject(UserService);
	_formBuilder = inject(FormBuilder);
	_childActionService = inject(ChildActionService)
	@Input() componentUniqueId: any;

	constructor() {
		this.initialForm();
	}

	initialForm() {
		this.entityForm = this._formBuilder.group({});

		/*this.validationMessages = {
			age: {
				required: 'error text ...',
				pattern: 'error text ...',
			},
			price: {
				'error text ...',
				'error text ...',
			}
		};*/
	}

	ngOnInit(): void {
		this.sub = this._childActionService.action$.subscribe(action => {
			if (action.componentUniqueId == this.componentUniqueId) this.onCallChildMethod(action.method, action.args);
		});

		this.entityForm?.valueChanges.subscribe(() => this.updateErrorMessages());
		this.loadFormData();
	}

	ngOnDestroy() {
		this.sub?.unsubscribe();

	}

	onCallChildMethod(method: MethodName, args: any[] = []) {
		const fn = this.functionMaps[method];
		if (fn) {
			fn(...args);
		} else {
			console.warn(`Method "${method}" not implemented in child`);
		}
	}

	callFromParent(targetTadId: any, method: string, ...args: any[]) {
		this._childActionService.trigger(targetTadId, method, ...args);
	}

	functionMaps: Record<MethodName, (...a: any[]) => void> = {
		//refresh: () => this.refresh(),
		//openModal: (id?: string) => this.openModal(id),
		//resetForm: () => this.resetForm(),
		// add more as needed
	};

	loadFormData() {

	}

	refreshFormData() {
		this.loadFormData()
	}

	onNumberInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const oldValue = input.value;
		const numericValue = oldValue.replace(/[^0-9]/g, '');

		if (numericValue !== oldValue) {
			input.value = numericValue;

			const newEvent = new Event('input', { bubbles: true });
			input.dispatchEvent(newEvent);
		}
	}

	updateErrorMessages() {
    this.formErrors = {};

    for (const field in this.entityForm?.controls) {
      this.formErrors[field] = '';
      const control = this.entityForm?.get(field);

      if ((control && control.dirty || control?.touched) && control.invalid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}