import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskPipe } from 'ngx-mask';
import { catchError, debounceTime, distinctUntilChanged, map, of, Subject, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Agent } from '../../../core/models/agent.model';
import { AgentService } from '../../../core/services/agent.service';
import { ExcelExportService } from '../../../core/services/excel-export.service';

@Component({
  selector: 'app-agents-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxMaskPipe],
  templateUrl: './agents-list.component.html',
  styleUrl: './agents-list.component.css'
})
export class AgentsListComponent implements OnInit {
  private agentService = inject(AgentService);
  private router = inject(Router);
  private excelService = inject(ExcelExportService);

  agents = signal<Agent[]>([]);
  loading = signal(true);
  showDeleteAlert = signal(false);
  agentToDelete = signal<Agent | null>(null);
  searchTerm = signal('');
  statusFilter = signal<string>('all');

  currentPage = signal(1);
  pageSize = signal(12);
  totalRecords = signal(0);
  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading.set(true);
        if (!term.trim()) {
          this.currentPage.set(1);
          return this.getAgentsByStatus();
        }
        return this.agentService.searchAgents(term).pipe(
          map((agents: Agent[]) => ({ agents, totalRecords: agents.length })),
          catchError(() => of({ agents: [], totalRecords: 0 }))
        );
      })
    ).subscribe({
      next: (result: { agents: Agent[], totalRecords: number }) => {
        this.agents.set(result.agents);
        this.totalRecords.set(result.totalRecords);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filteredAgents = computed(() => this.agents());

  ngOnInit(): void {
    this.loadAgents();
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.searchSubject.next(term);
  }

  onStatusChange(status: string) {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.loadAgents();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadAgents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadAgents() {
    this.loading.set(true);
    this.getAgentsByStatus().subscribe({
      next: (result: { agents: Agent[], totalRecords: number }) => {
        this.agents.set(result.agents);
        this.totalRecords.set(result.totalRecords);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando agentes', err);
        this.loading.set(false);
      }
    });
  }

  private getAgentsByStatus() {
    const status = this.statusFilter();
    let statusBool: boolean | undefined = undefined;

    if (status === 'active') statusBool = true;
    if (status === 'inactive') statusBool = false;

    return this.agentService.getAgents(this.currentPage(), this.pageSize(), statusBool);
  }

  getProfileImage(agent: Agent): string {
    const serverUrl = environment.apiUrl.replace('/api', '');
    if (agent.photo && agent.photo.trim() !== '') {
      const path = agent.photo.startsWith('/') ? agent.photo.substring(1) : agent.photo;
      return `${serverUrl}/${path}`;
    }

    const defaultImg = agent.gender === 'F' ? 'default-female.jpg' : 'default-male.jpg';
    return `${serverUrl}/agents/${defaultImg}`;
  }

  onEdit(agentId: number) {
    this.router.navigate(['/app/agents/edit', agentId]);
  }

  onDeleteRequest(agent: Agent) {
    this.agentToDelete.set(agent);
    this.showDeleteAlert.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmDelete() {
    const agent = this.agentToDelete();
    if (!agent) return;

    this.agentService.deleteAgent(agent.id).subscribe({
      next: () => {
        this.showDeleteAlert.set(false);
        this.agents.update(prev => prev.filter(a => a.id !== agent.id));
        this.agentToDelete.set(null);
      },
      error: (err) => {
        console.error('Error eliminando agente:', err);
      }
    });
  }

  exportToExcel() {
    this.loading.set(true);
    const status = this.statusFilter();
    let statusBool: boolean | undefined = undefined;
    if (status === 'active') statusBool = true;
    if (status === 'inactive') statusBool = false;

    // Obtener todos los registros sin paginación (límite de 10,000 registros para descarga completa)
    this.agentService.getAgents(1, 10000, statusBool).subscribe({
      next: (result) => {
        const headers = [
          'Código Empleado', 
          'Nombre Completo', 
          'Cédula', 
          'Género', 
          'Teléfono', 
          'Correo Electrónico', 
          'Rango', 
          'Institución', 
          'Estado'
        ];
        const keys = [
          'agentCode', 
          'fullName', 
          'identification', 
          'genderText', 
          'phone', 
          'email', 
          'rankName', 
          'institutionName', 
          'statusText'
        ];

        const mappedData = result.agents.map(a => ({
          ...a,
          genderText: a.gender === 'F' ? 'Femenino' : 'Masculino',
          statusText: a.status ? 'Activo' : 'Inactivo',
          email: a.email || 'N/A'
        }));

        this.excelService.exportToExcel(
          mappedData,
          headers,
          keys,
          `Listado_Agentes_HDSSD_${new Date().toISOString().split('T')[0]}`,
          'Agentes'
        );
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al exportar agentes a Excel', err);
        this.loading.set(false);
      }
    });
  }
}
