import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Icon } from './shared/icon/icon';
import { ToastContainerComponent } from "./shared/toast-container/toast-container";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Icon, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('office-utilities');
}
