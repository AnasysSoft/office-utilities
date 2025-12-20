import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFoundComponent {
	private _location = inject(Location);
	private _router = inject(Router);

	goBack() {
		this._location.back();
	}

	goHome() {
		this._router.navigate(['/']);
	}
}