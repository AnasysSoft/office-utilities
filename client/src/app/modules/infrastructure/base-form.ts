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
	protected entityForm: FormGroup;
	private sub?: Subscription;

	_router = inject(Router);
	_changeDetectorRef = inject(ChangeDetectorRef);
	_userService = inject(UserService);
	_formBuilder = inject(FormBuilder);
	_childActionService = inject(ChildActionService)
	@Input() componentUniqueId: any;
	
	constructor() {
		this.entityForm = this._formBuilder.group({}) 
	}

	ngOnInit(): void { 
		this.sub = this._childActionService.action$.subscribe(action => {
		if(action.componentUniqueId == this.componentUniqueId)  this.onCallChildMethod(action.method, action.args);
		});

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
}