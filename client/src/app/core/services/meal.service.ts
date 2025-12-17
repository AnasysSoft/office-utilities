import { Injectable, signal } from '@angular/core';

export interface DayReservation {
  dateIso: string;
  selectedFoodId?: number;
  selectedFoodName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MealService {
    private reservations = signal<Map<string, DayReservation>>(new Map());

    setReservation(dateIso: string, foodName: string, foodId: number) {
        this.reservations.update((map) => {
            const newMap = new Map(map);
            newMap.set(dateIso, { dateIso, selectedFoodName: foodName, selectedFoodId: foodId });
            return newMap;
        });
    }

    getReservation(dateIso: string) {
        return this.reservations().get(dateIso);
    }
}