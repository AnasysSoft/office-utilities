import { Injectable, signal } from '@angular/core';

export interface DayReservation {
	dateIso: string;
	selectedFoodId?: number;
	selectedSideId?: number;
	selectedFoodName?: string;
	quantity: number;
}

export interface DailyMenuStatus {
	dateIso: string;
	isMenuSet: boolean;
	mainCount: number;
  	sideCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class MealService {
	private reservations = signal<Map<string, DayReservation>>(new Map());

	private dailyMenus = signal<Map<string, DailyMenuStatus>>(new Map());

	setReservation(dateIso: string, foodName: string, mainId: number, sideId: number | null, quantity: number) {
		this.reservations.update((map) => {
			const newMap = new Map(map);
				newMap.set(dateIso, { 
					dateIso, 
					selectedFoodName: foodName, 
					selectedFoodId: mainId,
					selectedSideId: sideId || undefined,
					quantity: quantity 
				});
			return newMap;
		});
	}

	getReservation(dateIso: string) {
		return this.reservations().get(dateIso);
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

	getDailyMenuStatus(dateIso: string): DailyMenuStatus {
		const status = this.dailyMenus().get(dateIso);
		return status || { dateIso, isMenuSet: false, mainCount: 0, sideCount: 0 };
	}
}