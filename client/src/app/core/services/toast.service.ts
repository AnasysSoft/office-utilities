import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  text: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts = signal<ToastMessage[]>([]);
    show(title: string, text: string, type: ToastType = 'success', duration: number = 2000) {
        const id = Date.now();
        const toast: ToastMessage = { id, type, title, text, duration };

        this.toasts.update((current) => [toast, ...current]);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }

    remove(id: number) {
        this.toasts.update((current) => current.filter((t) => t.id !== id));
    }
}