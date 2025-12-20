import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MealService } from '../../../core/services/meal.service';
import { ToastService } from '../../../core/services/toast.service';
import { Icon } from '../../../shared/icon/icon';

interface FoodItem {
  id: number;
  name: string;
  type: 'main' | 'side';
}

@Component({
  selector: 'food-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Icon],
  templateUrl: './food-management.html',
  styleUrl: './food-management.scss'
})
export class FoodManagement implements OnInit {
    private _fb = inject(FormBuilder);
    private _location = inject(Location);
    private _mealService = inject(MealService);
    private _toastService = inject(ToastService);

    foods = signal<FoodItem[]>([]);
    
    mainFoods = computed(() => this.foods().filter(f => f.type === 'main'));
    sideFoods = computed(() => this.foods().filter(f => f.type === 'side'));

    foodForm!: FormGroup;
    
    isEditing = false;
    editingId: number | null = null;
    isPanelOpen = false;
    deleteId: number | null = null;

    ngOnInit() {
        this.loadFoods();
        this.initForm();
    }

    loadFoods() {
        this.foods.set([
            { id: 1, name: 'چلو کباب کوبیده', type: 'main' },
            { id: 2, name: 'زرشک پلو با مرغ', type: 'main' },
            { id: 3, name: 'قورمه سبزی', type: 'main' },
            { id: 101, name: 'نوشابه قوطی', type: 'side' },
            { id: 102, name: 'ماست موسیر', type: 'side' },
            { id: 103, name: 'دوغ محلی', type: 'side' },
        ]);
    }

    initForm() {
        this.foodForm = this._fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            type: ['main', [Validators.required]]
        });
    }

    openPanel(food?: FoodItem) {
        this.isPanelOpen = true;
        
        if (food) {
            this.isEditing = true;
            this.editingId = food.id;
            this.foodForm.patchValue({
                name: food.name,
                type: food.type
            });
        } else {
            this.isEditing = false;
            this.editingId = null;
            this.foodForm.reset({ type: 'main' });
        }
    }

    closePanel() {
        this.isPanelOpen = false;
    }

    saveFood() {
        if (this.foodForm.invalid) {
            this.foodForm.markAllAsTouched();
            return;
        }

        const formValue = this.foodForm.value;

        if (this.isEditing && this.editingId) {
            this.foods.update(list => 
                list.map(f => f.id === this.editingId ? { ...f, ...formValue } : f)
            );
            this._toastService.show('موفق', 'غذا با موفقیت ویرایش شد.', 'success');
        } else {
            const newId = Date.now();
            this.foods.update(list => [...list, { id: newId, ...formValue }]);
            this._toastService.show('موفق', 'غذای جدید اضافه شد.', 'success');
        }

        this.closePanel();
    }

    deleteFood(id: number) {
        this.deleteId = id;
    }

    confirmDelete() {
        if (this.deleteId) {
            this.foods.update(list => list.filter(f => f.id !== this.deleteId));
            this._toastService.show('حذف', 'مورد با موفقیت حذف شد.', 'warning');
            this.deleteId = null;
        }
    }

    cancelDelete() {
        this.deleteId = null;
    }

    goBack() {
        this._location.back();
    }
}