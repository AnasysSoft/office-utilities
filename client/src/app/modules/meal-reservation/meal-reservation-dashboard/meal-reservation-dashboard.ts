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

    isUserDropdownOpen = false;
    @ViewChild('userButton') userButton?: ElementRef;

    ngOnInit(): void {
        this.calculateDate();
    }

    navigateTo(path: 'reserve' | 'guest') {
        this._router.navigate([path], { relativeTo: this._activatedRoute });
    }

    navigateToSchedule() {
        this.isAdminDropdownOpen = false;
        this._router.navigate(['reserve'], { 
            relativeTo: this._activatedRoute,
            queryParams: { mode: 'admin' }
        });
    }

    toggleAdminDropdown(event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.isAdminDropdownOpen = !this.isAdminDropdownOpen;
    }

	@HostListener('document:click', ['$event']) handleOutsideClick(event: MouseEvent): void {
        if (this.isAdminDropdownOpen) {
            const clickedInsideAdmin = this.adminButton?.nativeElement?.contains(event.target);
            if (!clickedInsideAdmin) this.isAdminDropdownOpen = false;
        }

        if (this.isUserDropdownOpen) {
            const clickedInsideUser = this.userButton?.nativeElement?.contains(event.target);
            if (!clickedInsideUser) this.isUserDropdownOpen = false;
        }
    }

    navigateToReservationsReview() {
        this.isAdminDropdownOpen = false;
        this._router.navigate(['reserve'], { 
            relativeTo: this._activatedRoute,
            queryParams: { mode: 'reservations' }
        });
    }

    private calculateDate() {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        this.currentDate = new Intl.DateTimeFormat('fa-IR', options).format(new Date());
    }

    toggleUserDropdown(event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.isAdminDropdownOpen = false;
        this.isUserDropdownOpen = !this.isUserDropdownOpen;
    }

    navigateToProfile() {
        this.isUserDropdownOpen = false;
        this._router.navigate(['profile'], { relativeTo: this._activatedRoute });
    }

    logout() {
        this.isUserDropdownOpen = false;
        console.log('User logged out');
        // this._authService.logout();
        this._router.navigate(['/login']); 
    }

    navigateToFoodManagement() {
        this.isAdminDropdownOpen = false;
        this._router.navigate(['admin/foods'], { relativeTo: this._activatedRoute });
    }
}