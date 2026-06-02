import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';
@Component({
  selector: 'app-ui-alert',
  imports: [NgClass],
  templateUrl: './ui-alert.component.html',
  styleUrl: './ui-alert.component.css',
})
export class UiAlertComponent {

  @Input() type: AlertType = 'info'; 
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() dismissible: boolean = true; 

  isVisible: boolean = true;

  closeAlert() {
    this.isVisible = false;
  }

  get iconClass(): string {
    switch (this.type) {
      case 'success': return 'bi-check-circle-fill';
      case 'danger': return 'bi-exclamation-triangle-fill';
      case 'warning': return 'bi-exclamation-circle-fill';
      case 'info': return 'bi-info-circle-fill';
      default: return 'bi-info-circle-fill';
    }
  }
}
