import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AuditService } from '../../core/services/audit.service';
import { AuditLog } from '../../core/models/audit-log.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './audit-logs.component.html'
})
export class AuditLogsComponent implements OnInit {
  private auditService = inject(AuditService);

  logs = signal<AuditLog[]>([]);
  totalRecords = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = 15;

  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading.set(true);
    this.auditService.getLogs(this.currentPage(), this.pageSize).subscribe({
      next: (result) => {
        this.logs.set(result.logs);
        this.totalRecords.set(result.totalRecords);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadLogs();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords() / this.pageSize);
  }

  getActionBadgeClass(action: string): string {
    if (action.includes('Cierre')) return 'bg-success';
    if (action.includes('Eliminación')) return 'bg-danger';
    if (action.includes('Reapertura')) return 'bg-warning text-dark';
    if (action.includes('Asignación')) return 'bg-primary';
    return 'bg-secondary';
  }
}
