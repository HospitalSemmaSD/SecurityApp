import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AuditService } from '../../core/services/audit.service';
import { AuditLog } from '../../core/models/audit-log.model';
import { ExcelExportService } from '../../core/services/excel-export.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './audit-logs.component.html'
})
export class AuditLogsComponent implements OnInit {
  private auditService = inject(AuditService);
  private excelService = inject(ExcelExportService);

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

  exportToExcel(): void {
    this.isLoading.set(true);
    // Obtener los primeros 10,000 registros para descarga completa
    this.auditService.getLogs(1, 10000).subscribe({
      next: (result) => {
        const headers = [
          'ID Usuario', 
          'Nombre de Usuario', 
          'Acción', 
          'Entidad Modificada', 
          'ID Registro', 
          'Detalles', 
          'Fecha y Hora (Local)'
        ];
        const keys = [
          'userId', 
          'userName', 
          'action', 
          'entityType', 
          'entityId', 
          'details', 
          'localTime'
        ];

        const mappedData = result.logs.map(log => ({
          ...log,
          entityId: log.entityId || 'N/A',
          details: log.details || 'N/A',
          localTime: new Date(log.timestamp).toLocaleString('es-DO')
        }));

        this.excelService.exportToExcel(
          mappedData,
          headers,
          keys,
          `Bitacora_Auditoria_HDSSD_${new Date().toISOString().split('T')[0]}`,
          'Bitácora'
        );
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al exportar bitácora a Excel', err);
        this.isLoading.set(false);
      }
    });
  }
}
