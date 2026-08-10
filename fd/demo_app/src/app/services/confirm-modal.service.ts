import { Injectable, signal } from '@angular/core';

export interface ConfirmConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isAlert?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  isOpen = signal<boolean>(false);
  config = signal<ConfirmConfig>({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isAlert: false
  });

  private resolvePromise?: (value: boolean) => void;

  confirm(options?: ConfirmConfig): Promise<boolean> {
    this.config.set({
      title: options?.title || 'Delete Confirmation',
      message: options?.message || 'Are you sure you want to delete this item?',
      confirmText: options?.confirmText || 'Confirm',
      cancelText: options?.cancelText || 'Cancel',
      isAlert: options?.isAlert ?? false
    });

    this.isOpen.set(true);

    return new Promise<boolean>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  onConfirm(): void {
    this.isOpen.set(false);
    if (this.resolvePromise) this.resolvePromise(true);
  }

  onCancel(): void {
    this.isOpen.set(false);
    if (this.resolvePromise) this.resolvePromise(false);
  }
}