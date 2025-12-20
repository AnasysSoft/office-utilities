import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Icon } from '../../../shared/icon/icon';
import { MealService, UserDailyReservation } from '../../../core/services/meal.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-daily-reservations-list',
  standalone: true,
  imports: [CommonModule, Icon, FormsModule],
  templateUrl: './daily-reservations-list.html',
  styleUrl: './daily-reservations-list.scss'
})
export class DailyReservationsList implements OnInit {
	private _route = inject(ActivatedRoute);
	private _location = inject(Location);
	private _mealService = inject(MealService);
	private _toastService = inject(ToastService);

	targetDate: string = '';
	persianDateLabel: string = '';
	
	rawReservations = signal<UserDailyReservation[]>([]);
	searchTerm = signal<string>('');
	activeTab = signal<'all' | 'pending' | 'approved'>('all');

	filteredReservations = computed(() => {
		let list = this.rawReservations();
		const term = this.searchTerm().toLowerCase();
		const tab = this.activeTab();

		// 1. Filter by Tab
		if (tab === 'pending') list = list.filter(r => !r.isApproved);
		if (tab === 'approved') list = list.filter(r => r.isApproved);

		// 2. Filter by Search
		if (term) {
			list = list.filter(res => 
				res.userName.toLowerCase().includes(term) || 
				res.personnelCode.includes(term)
			);
		}
		return list;
	});

	stats = computed(() => {
		const list = this.rawReservations();
		const total = list.length;
		const approved = list.filter(r => r.isApproved).length;
		const percentage = total > 0 ? Math.round((approved / total) * 100) : 0;
		
		return { total, approved, percentage };
	});

	ngOnInit() {
		this._route.queryParams.subscribe(params => {
			this.targetDate = params['date'];
			this.persianDateLabel = params['persianDate'];
			this.loadData();
		});
	}

	loadData() {
		const data = this._mealService.getDailyUserReservations(this.targetDate);
		this.rawReservations.set(data);
	}

	goBack() {
		this._location.back();
	}

	toggleApproval(res: UserDailyReservation) {
		this._mealService.toggleReservationApproval(this.targetDate, res.id);
		this.loadData();
	}

	setTab(tab: 'all' | 'pending' | 'approved') {
		this.activeTab.set(tab);
	}

	printList() {
		window.print();
	}

	finalizeList() {
		const approvedIds = this.rawReservations()
			.filter(r => r.isApproved)
			.map(r => r.id);

		console.log('Finalizing list for:', this.targetDate, 'Approved IDs:', approvedIds);
		
		this._mealService.finalizeDailyList(this.targetDate);
		
		this._toastService.show('ثبت موفق', 'لیست با موفقیت ثبت نهایی شد.', 'success', 3000);
		this.goBack();
	}
}