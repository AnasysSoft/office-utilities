import { Injectable, signal } from '@angular/core';

export interface DayReservation {
	dateIso: string;
	selectedFoodId?: number;
	selectedSideId?: number;
	selectedFoodName?: string;
	quantity: number;
	isGuest?: boolean;
  	guestName?: string;
}

export interface UserDailyReservation {
	id: number;
	userId: string;
	userName: string;
	personnelCode: string;
	foodName: string;
	sideName?: string;
	quantity: number;
	isApproved: boolean;
}

export interface DailyMenuStatus {
	dateIso: string;
	isMenuSet: boolean;
	mainCount: number;
  	sideCount: number;
	isFinalized?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MealService {
	private reservations = signal<Map<string, DayReservation>>(new Map());

	private dailyMenus = signal<Map<string, DailyMenuStatus>>(new Map());

	private dailyUserReservations = signal<Map<string, UserDailyReservation[]>>(new Map());

	private userReservations = signal<Map<string, DayReservation>>(new Map());

  	private guestReservations = signal<Map<string, DayReservation>>(new Map());

	constructor() {
		this.seedMockData();
	}

	setReservation(dateIso: string, foodName: string, mainId: number, sideId: number | null, quantity: number, guestName?: string) {
    
		const isGuest = !!guestName;
		const targetSignal = isGuest ? this.guestReservations : this.userReservations;

		targetSignal.update((map) => {
		const newMap = new Map(map);
		const key = isGuest ? `${dateIso}_${guestName}` : dateIso;

		newMap.set(key, { 
			dateIso, 
			selectedFoodName: foodName, 
			selectedFoodId: mainId,
			selectedSideId: sideId || undefined,
			quantity: quantity,
			isGuest,
			guestName
		});
			return newMap;
		});
	}

	getReservation(dateIso: string, guestName?: string) {
		if (guestName) {
			const key = `${dateIso}_${guestName}`;
			return this.guestReservations().get(key);
		} else {
			return this.userReservations().get(dateIso);
		}
	}
	
	getGuestCountForDay(dateIso: string): number {
		let totalGuests = 0;
		this.guestReservations().forEach((res) => {
			if (res.dateIso === dateIso) {
				totalGuests += res.quantity; 
			}
		});
		return totalGuests;
	}

	private seedMockData() {
		const today = new Date().toISOString().split('T')[0];
		const mockData: UserDailyReservation[] = [
		{ id: 1, userId: 'u1', userName: 'علی محمدی', personnelCode: '123456', foodName: 'چلو کباب', sideName: 'نوشابه', quantity: 1, isApproved: false },
		{ id: 2, userId: 'u2', userName: 'سارا احمدی', personnelCode: '654321', foodName: 'زرشک پلو', sideName: 'دوغ', quantity: 2, isApproved: true },
		{ id: 3, userId: 'u3', userName: 'رضا کمالی', personnelCode: '987654', foodName: 'قورمه سبزی', quantity: 1, isApproved: false },
		];
		
		this.dailyUserReservations.update(map => {
			const newMap = new Map(map);
			newMap.set(today, mockData); 
			return newMap;
		});
	}

	getDailyUserReservations(dateIso: string): UserDailyReservation[] {
		return this.dailyUserReservations().get(dateIso) || [];
	}

	toggleReservationApproval(dateIso: string, reservationId: number) {
		this.dailyUserReservations.update((map) => {
			const newMap = new Map(map);
			const list = newMap.get(dateIso) || [];
			
			const updatedList = list.map(item => 
				item.id === reservationId ? { ...item, isApproved: !item.isApproved } : item
			);
			
			newMap.set(dateIso, updatedList);
			return newMap;
		});
	}

	setDailyMenuStatus(dateIso: string, mainCount: number, sideCount: number) {
		this.dailyMenus.update((map) => {
			const newMap = new Map(map);
			newMap.set(dateIso, {
				dateIso,
				isMenuSet: (mainCount + sideCount) > 0,
				mainCount,
				sideCount
			});
			return newMap;
		});
	}

	finalizeDailyList(dateIso: string) {
		this.dailyMenus.update((map) => {
		const newMap = new Map(map);
		const currentStatus = newMap.get(dateIso);
		
		if (currentStatus) {
			newMap.set(dateIso, { ...currentStatus, isFinalized: true });
		} else {
			newMap.set(dateIso, { 
				dateIso, 
				isMenuSet: false, 
				mainCount: 0, 
				sideCount: 0, 
				isFinalized: true 
			});
		}
		return newMap;
		});
	}

	getDailyMenuStatus(dateIso: string): DailyMenuStatus {
		const status = this.dailyMenus().get(dateIso);
		return status || { dateIso, isMenuSet: false, mainCount: 0, sideCount: 0, isFinalized: false };
	}
}