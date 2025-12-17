import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../core/services/toast.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './toast-container.html',
  styleUrls: ['./toast-container.scss'],
})
export class ToastContainerComponent {
	toastService = inject(ToastService);

	getIconName(type: ToastType): string {
		switch (type) {
			case 'success': return 'check-circle';
			case 'error': return 'x-circle';
			case 'warning': return 'exclamation-triangle';
			case 'info': return 'information-circle';
			default: return 'information-circle';
		}
	}
}