import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommunicationService } from '../../../core/services/communication.service';
import { ShiftIncident } from '../../../core/models/communication.model';

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './incidents-list.component.html'
})
export class IncidentsListComponent implements OnInit {
  private commsService = inject(CommunicationService);
  
  incidents = signal<ShiftIncident[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.isLoading.set(true);
    this.commsService.getRecentIncidents().subscribe({
      next: (data) => {
        this.incidents.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning text-dark';
      default: return 'bg-info';
    }
  }
}
