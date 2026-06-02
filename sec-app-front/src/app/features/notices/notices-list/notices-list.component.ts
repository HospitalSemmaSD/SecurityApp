import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommunicationService } from '../../../core/services/communication.service';
import { InternalNotice } from '../../../core/models/communication.model';

@Component({
  selector: 'app-notices-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './notices-list.component.html'
})
export class NoticesListComponent implements OnInit {
  private commsService = inject(CommunicationService);
  
  notices = signal<InternalNotice[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadNotices();
  }

  loadNotices(): void {
    this.isLoading.set(true);
    this.commsService.getActiveNotices().subscribe({
      next: (data) => {
        this.notices.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
