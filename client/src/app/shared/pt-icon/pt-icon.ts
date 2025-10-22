import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'pt-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pt-icon.html',
  styleUrl: './pt-icon.scss'
})
export class PtIcon {
	@Input() name: string = '';
	@Input() className: string = 'w-5 h-5';
	@Input() spritePath: string = '/assets/icons/icons.svg';
}
