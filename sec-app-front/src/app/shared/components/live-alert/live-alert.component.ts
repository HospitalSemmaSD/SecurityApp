import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalRService, UrgentNotice } from '../../../core/services/signalr.service';

@Component({
  selector: 'app-live-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-alert.component.html',
  styles: [`
    .urgent-banner {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
      animation: slideDown 0.5s ease;
    }
    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
  `]
})
export class LiveAlertComponent implements OnInit {
  private signalR = inject(SignalRService);
  
  currentNotice = signal<UrgentNotice | null>(null);

  ngOnInit(): void {
    this.signalR.urgentNotice$.subscribe(notice => {
      this.currentNotice.set(notice);
    });
  }

  close(): void {
    this.currentNotice.set(null);
  }
}
