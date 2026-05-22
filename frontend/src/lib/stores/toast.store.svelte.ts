// src/lib/stores/toast.store.svelte.ts
export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Utilisation d'une classe avec $state pour un store global Svelte 5
class ToastState {
  toasts = $state<ToastMessage[]>([]);

  // Ajoute un toast qui disparaît après 3 secondes (3000ms)
  add(message: string, type: ToastType = 'info', duration = 3000) {
    const id = crypto.randomUUID();
    this.toasts.push({ id, message, type });
    
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}

// On exporte une instance unique pour toute l'application
export const toastStore = new ToastState();