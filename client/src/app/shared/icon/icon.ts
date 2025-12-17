import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
	@Input() name: string = '';
	@Input() className: string = 'w-5 h-5';
	@Input() spritePath: string = '/assets/icons/icons.svg';
}
