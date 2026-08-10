import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast"
        [ngClass]="toast.type"
      >
        <span>{{ toast.message }}</span>
        <button (click)="toastService.remove(toast.id)">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: 0.85rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      min-width: 280px;
      animation: slideIn 0.2s ease-out;
    }
    .toast.success {
      background: #2C221E;
      color: #FFFFFF;
      border-left: 4px solid #C27835;
    }
    .toast.error {
      background: #FFF1F0;
      color: #E5484D;
      border-left: 4px solid #E5484D;
    }
    .toast.info {
      background: #F8F5F0;
      color: #2C221E;
      border-left: 4px solid #8C6D53;
    }
    .toast button {
      background: transparent;
      border: none;
      color: inherit;
      font-size: 1rem;
      cursor: pointer;
      opacity: 0.7;
    }
    .toast button:hover {
      opacity: 1;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}