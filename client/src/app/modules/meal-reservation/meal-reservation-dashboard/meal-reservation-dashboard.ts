import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'meal-reservation-dashboard',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, Icon],
  templateUrl: './meal-reservation-dashboard.html',
  styleUrl: './meal-reservation-dashboard.scss',
})
export class MealReservationDashboard implements OnInit {
    private _router = inject(Router);
    private _activatedRoute = inject(ActivatedRoute);
    private _elementRef = inject(ElementRef);
    
    currentDate: string = '';
    isAdminDropdownOpen = false;

    @ViewChild('adminButton') adminButton?: ElementRef;

    ngOnInit(): void {
        this.calculateDate();
    }

    navigateTo(path: 'reserve' | 'guest') {
        this._router.navigate([path], { relativeTo: this._activatedRoute });
    }

    navigateToSchedule() {
        this.isAdminDropdownOpen = false;
        this._router.navigate(['reserve'], { relativeTo: this._activatedRoute }); 
    }

    toggleAdminDropdown(event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.isAdminDropdownOpen = !this.isAdminDropdownOpen;
    }

	@HostListener('document:click', ['$event']) handleOutsideClick(event: MouseEvent): void {
        if (!this.isAdminDropdownOpen) return;

        const clickedInsideMenu = this.adminButton?.nativeElement?.contains(
            event.target
        );

        if (!clickedInsideMenu) {
            this.isAdminDropdownOpen = false;
        }
    }

    private calculateDate() {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        this.currentDate = new Intl.DateTimeFormat('fa-IR', options).format(new Date());
    }
}