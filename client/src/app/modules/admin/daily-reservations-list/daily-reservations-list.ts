import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Icon } from '../../../shared/icon/icon';
import { MealService, UserDailyReservation, ReservationStatus } from '../../../core/services/meal.service';
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
    userTypeFilter = signal<'personnel' | 'guest'>('personnel');
    statusFilter = signal<ReservationStatus | 'all'>('all');

    isRejectModalOpen = false;
    rejectTarget: UserDailyReservation | null = null;
    selectedReason: ReservationStatus = 'absent';

    rejectionReasons: { value: ReservationStatus, label: string }[] = [
        { value: 'absent', label: 'غیبت' },
        { value: 'leave', label: 'مرخصی' },
        { value: 'mission', label: 'ماموریت' },
        { value: 'not_reserved', label: 'عدم رزرو' },
        { value: 'rejected', label: 'لغو توسط ادمین' }
    ];

	
    filteredReservations = computed(() => {
        let list = this.rawReservations();
        const term = this.searchTerm().toLowerCase();
        const type = this.userTypeFilter();
        const status = this.statusFilter();

        list = list.filter(r => r.type === type);

        if (status !== 'all') {
            list = list.filter(r => r.status === status);
        }

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
        const typeFiltered = list.filter(r => r.type === this.userTypeFilter());

        return {
            total: typeFiltered.length,
            approved: typeFiltered.filter(r => r.status === 'approved').length,
            absent: typeFiltered.filter(r => r.status === 'absent').length,
            leave: typeFiltered.filter(r => r.status === 'leave').length,
            mission: typeFiltered.filter(r => r.status === 'mission').length,
            rejected: typeFiltered.filter(r => ['rejected', 'not_reserved'].includes(r.status)).length,
        };
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

    setUserType(type: 'personnel' | 'guest') {
        this.userTypeFilter.set(type);
        this.statusFilter.set('all');
    }

    filterByStatus(status: ReservationStatus | 'all') {
        if (this.statusFilter() === status && status !== 'all') {
            this.statusFilter.set('all');
        } else {
            this.statusFilter.set(status);
        }
    }

    handleCardClick(res: UserDailyReservation) {
        if (res.status === 'approved') {
            this.openRejectModal(res);
        } else {
            this.updateStatus(res.id, 'approved');
        }
    }

    openRejectModal(res: UserDailyReservation) {
        this.rejectTarget = res;
        this.selectedReason = 'absent'; 
        this.isRejectModalOpen = true;
    }

    closeRejectModal() {
        this.isRejectModalOpen = false;
        this.rejectTarget = null;
    }

    confirmRejection() {
        if (this.rejectTarget) {
            this.updateStatus(this.rejectTarget.id, this.selectedReason);
            this.closeRejectModal();
        }
    }

    updateStatus(id: number, status: ReservationStatus) {
        this.rawReservations.update(list => 
            list.map(item => item.id === id ? { ...item, status } : item)
        );
    }

    printList() {
        window.print();
    }

    finalizeList() {
        this._mealService.finalizeDailyList(this.targetDate);
        this._toastService.show('ثبت موفق', 'لیست نهایی شد.', 'success');
        this.goBack();
    }

    getStatusLabel(status: ReservationStatus): string {
        const map: Record<string, string> = {
            'approved': 'تایید شده',
            'absent': 'غیبت',
            'leave': 'مرخصی',
            'mission': 'ماموریت',
            'not_reserved': 'رزرو نشده',
            'rejected': 'لغو شده'
        };
        return map[status] || status;
    }

    getStatusColor(status: ReservationStatus): string {
        const map: Record<string, string> = {
            'approved': 'text-green-600 bg-green-50 border-green-200',
            'absent': 'text-red-600 bg-red-50 border-red-200',
            'leave': 'text-orange-600 bg-orange-50 border-orange-200',
            'mission': 'text-blue-600 bg-blue-50 border-blue-200',
            'not_reserved': 'text-gray-500 bg-gray-100 border-gray-300',
            'rejected': 'text-gray-600 bg-gray-50 border-gray-200'
        };
        return map[status] || 'text-gray-500';
    }

	getFilterChipStyle(status: ReservationStatus | 'all'): string {
        const isActive = this.statusFilter() === status;
        
        let classes = 'border transition-all duration-200 font-bold text-[10px] ';

        if (isActive) {
            return classes + 'bg-primary text-white border-primary shadow-md ring-2 ring-primary/20';
        } else {
            return classes + 'bg-white text-text-muted border-gray-200 hover:border-primary/50 hover:text-primary';
        }
    }

    getFilterBadgeStyle(status: ReservationStatus | 'all'): string {
        const isActive = this.statusFilter() === status;
        
        if (isActive) {
            return 'bg-white text-primary';
        } else {
            return 'bg-primary/10 text-primary';
        }
    }
}