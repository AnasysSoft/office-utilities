import { Injectable, signal } from '@angular/core';

export interface DayReservation {
  dateIso: string;
  selectedFoodId?: number;
  selectedSideId?: number;
  selectedFoodName?: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})

export class MealService {
	private reservations = signal<Map<string, DayReservation>>(new Map());

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
}