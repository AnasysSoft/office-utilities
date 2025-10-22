import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PtIcon } from './shared/pt-icon/pt-icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PtIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('office-utilities');
}
