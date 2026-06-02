import { CommonModule, formatDate } from '@angular/common';
import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, forkJoin } from 'rxjs';
import { Agent } from '../../../core/models/agent.model';
import { DutyAssignment } from '../../../core/models/duty-assignment.model';
import { DutyPost } from '../../../core/models/duty-post.model';
import { Responsible } from '../../../core/models/responsible.model';
import { Shift } from '../../../core/models/shift.model';
import { RosterTemplate } from '../../../core/models/template.model';
import { AgentService } from '../../../core/services/agent.service';
import { DutyPostService } from '../../../core/services/duty-post.service';
import { DutyRosterService } from '../../../core/services/duty-roster.service';
import { PdfReportService } from '../../../core/services/pdf-report.service';
import { ResponsibleService } from '../../../core/services/responsible.service';
import { ShiftService } from '../../../core/services/shift.service';
import { TemplateService } from '../../../core/services/template.service';

@Component({
  selector: 'app-roster-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roster-view.component.html',
  styleUrl: './roster-view.component.css'
})
export class RosterViewComponent implements OnInit {
  private agentService = inject(AgentService);
  private shiftService = inject(ShiftService);
  private postService = inject(DutyPostService);
  private rosterService = inject(DutyRosterService);
  private responsibleService = inject(ResponsibleService);
  private pdfService = inject(PdfReportService);
  private templateService = inject(TemplateService);
  private toastr = inject(ToastrService);

  @ViewChild('datePicker') datePicker!: ElementRef;

  selectedWeekStart = signal<string>(''); 
  assignments = signal<DutyAssignment[]>([]);
  shifts = signal<Shift[]>([]);
  posts = signal<DutyPost[]>([]);
  responsibles = signal<Responsible[]>([]);
  recentRosters = signal<string[]>([]);
  templates = signal<RosterTemplate[]>([]);

  isClosed = signal(false);
  isClosing = signal(false);
  isReopening = signal(false);
  isCloningRoster = signal(false);
  isSavingTemplate = signal(false);
  isLoadingTemplates = signal(false);
  isGeneratingSmart = signal(false);
  
  showCloseConfirmation = signal(false);
  showReopenConfirmation = signal(false);
  showClearConfirmation = signal(false);
  showTemplateModal = signal(false);
  showSaveTemplateModal = signal(false);
  showCloneConfirmation = signal(false);

  newTemplateName = '';
  cloneSourceDate = '';
  closedAt = signal<string | null>(null);
  closedPreparer = signal<any>(null);
  closedApprover = signal<any>(null);

  weekRangeText = computed(() => {
    if (!this.selectedWeekStart()) return 'Seleccionando semana...';
    const d = new Date(this.selectedWeekStart() + 'T12:00:00');
    const sunday = new Date(d);
    sunday.setDate(d.getDate() + 6);
    return `Semana del ${formatDate(d, 'dd/MM/yyyy', 'es-DO')} al ${formatDate(sunday, 'dd/MM/yyyy', 'es-DO')}`;
  });

  preparador = computed(() => {
    if (this.isClosed()) return this.closedPreparer();
    return this.responsibles().find(r => r.position === 'Sub-Encargado');
  });

  aprobador = computed(() => {
    if (this.isClosed()) return this.closedApprover();
    return this.responsibles().find(r => r.position === 'Encargado');
  });

  searchAgentsResults = signal<Agent[]>([]);
  isSearchingAgents = signal(false);
  private agentSearchSubject = new Subject<string>();

  selectedAgent = signal<Agent | null>(null);
  selectedShiftId = signal<number>(0);
  selectedPostId = signal<number>(0);
  isAssigning = signal(false);

  groupedAssignments = computed(() => {
    const data = this.assignments();
    const groups: { shiftName: string, timeRange: string, items: DutyAssignment[] }[] = [];
    const uniqueShiftNames = Array.from(new Set(data.map(a => a.shiftName)));
    uniqueShiftNames.forEach(shiftName => {
      const items = data.filter(a => a.shiftName === shiftName);
      if (items.length > 0) {
        groups.push({
          shiftName: shiftName,
          timeRange: items[0].shiftTimeRange || '',
          items: items
        });
      }
    });
    return groups;
  });

  ngOnInit() {
    this.setInitialWeek();
    this.loadInitialData();
    this.setupAgentSearch();
    this.loadRecentRosters();
    this.loadTemplates();
  }

  setInitialWeek() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    this.selectedWeekStart.set(monday.toISOString().split('T')[0]);
  }

  loadInitialData() {
    this.shiftService.getShifts().subscribe(data => this.shifts.set(data));
    this.postService.getDutyPosts().subscribe(data => this.posts.set(data));
    this.responsibleService.getActiveResponsibles().subscribe(data => this.responsibles.set(data));
    this.loadRoster();
  }

  loadTemplates() {
    this.templateService.getTemplates().subscribe(data => this.templates.set(data));
  }

  loadRecentRosters() {
    this.rosterService.getRecentRosters().subscribe({
      next: (dates) => {
        const sorted = [...dates].sort((a, b) => a.localeCompare(b));
        this.recentRosters.set(sorted);
      }
    });
  }

  loadRoster() {
    const startDate = this.selectedWeekStart();
    this.rosterService.getRosterStatus(startDate).subscribe({
      next: (status) => {
        if (status) {
          this.isClosed.set(status.isClosed);
          this.closedAt.set(status.closedAt || null);
          this.closedPreparer.set({ fullName: status.preparerName, rank: status.preparerRank, position: 'Sub-Encargado' });
          this.closedApprover.set({ fullName: status.approverName, rank: status.approverRank, position: 'Encargado' });
        } else {
          this.isClosed.set(false);
          this.closedAt.set(null);
          this.closedPreparer.set(null);
          this.closedApprover.set(null);
        }
      },
      error: () => {
        this.isClosed.set(false);
        this.closedAt.set(null);
      }
    });

    this.rosterService.getRosterByWeek(startDate).subscribe({
      next: (data) => this.assignments.set(data),
      error: () => this.toastr.error('Error al cargar la lista de servicio')
    });
  }

  onDateSelected(event: any) {
    const d = new Date(event.target.value + 'T12:00:00');
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    this.selectedWeekStart.set(monday.toISOString().split('T')[0]);
    this.loadRoster();
  }

  navigateWeek(offset: number) {
    const d = new Date(this.selectedWeekStart() + 'T12:00:00');
    d.setDate(d.getDate() + (offset * 7));
    this.selectedWeekStart.set(d.toISOString().split('T')[0]);
    this.loadRoster();
  }

  openSaveTemplate() {
    if (this.assignments().length === 0) {
      this.toastr.warning('No hay asignaciones para guardar como plantilla.');
      return;
    }
    this.showSaveTemplateModal.set(true);
  }

  saveTemplate() {
    if (!this.newTemplateName.trim()) return;

    this.isSavingTemplate.set(true);
    const baseData = this.assignments().map(a => ({
      agentId: a.agentId,
      shiftId: a.shiftId,
      dutyPostId: a.dutyPostId
    }));

    this.templateService.createTemplate({
      name: this.newTemplateName,
      jsonData: JSON.stringify(baseData)
    }).subscribe({
      next: () => {
        this.toastr.success('Plantilla guardada correctamente');
        this.showSaveTemplateModal.set(false);
        this.newTemplateName = '';
        this.loadTemplates();
        this.isSavingTemplate.set(false);
      },
      error: () => {
        this.toastr.error('Error al guardar plantilla');
        this.isSavingTemplate.set(false);
      }
    });
  }

  applyTemplate(templateId: number) {
    if (this.isClosed()) return;
    
    this.isLoadingTemplates.set(true);
    this.templateService.getTemplateData(templateId).subscribe({
      next: (data) => {
        const baseAssignments = JSON.parse(data.jsonData);
        const observables = baseAssignments.map((a: any) => {
          return this.rosterService.assignAgent({
            weekStartDate: this.selectedWeekStart(),
            agentId: a.agentId,
            shiftId: a.shiftId,
            dutyPostId: a.dutyPostId
          }).pipe(catchError(() => of(null)));
        });

        forkJoin(observables).subscribe(() => {
          this.toastr.success('Plantilla aplicada. Se omitieron duplicados si los hubo.');
          this.loadRoster();
          this.showTemplateModal.set(false);
          this.isLoadingTemplates.set(false);
        });
      }
    });
  }

  smartGenerate() {
    if (this.isClosed()) return;

    this.isGeneratingSmart.set(true);
    this.agentService.getAgents(1, 200).subscribe({
      next: (result) => {
        const agents = result.agents;
        const currentDay = new Date(this.selectedWeekStart() + 'T12:00:00').getDay().toString();
        
        const eligibleAgents = agents.filter(a => 
          a.status && 
          a.defaultShiftId && 
          a.defaultDutyPostId &&
          (!a.workDays || a.workDays.split(',').includes(currentDay))
        );

        if (eligibleAgents.length === 0) {
          this.toastr.info('No se encontraron oficiales con horarios definidos para este día.');
          this.isGeneratingSmart.set(false);
          return;
        }

        const observables = eligibleAgents.map(a => {
          return this.rosterService.assignAgent({
            weekStartDate: this.selectedWeekStart(),
            agentId: a.id,
            shiftId: a.defaultShiftId!,
            dutyPostId: a.defaultDutyPostId!
          }).pipe(catchError(() => of(null)));
        });

        forkJoin(observables).subscribe(() => {
          this.toastr.success('Generación inteligente completada.');
          this.loadRoster();
          this.isGeneratingSmart.set(false);
        });
      },
      error: () => {
        this.toastr.error('Error al obtener oficiales');
        this.isGeneratingSmart.set(false);
      }
    });
  }

  deleteTemplate(id: number, event: Event) {
    event.stopPropagation();
    if (!confirm('¿Seguro que desea eliminar esta plantilla?')) return;
    
    this.templateService.deleteTemplate(id).subscribe(() => {
      this.toastr.info('Plantilla eliminada');
      this.loadTemplates();
    });
  }

  selectRecentDate(date: string) {
    this.selectedWeekStart.set(date.split('T')[0]);
    this.loadRoster();
  }

  setToday() {
    this.setInitialWeek();
    this.loadRoster();
  }

  planNewRoster() {
    this.datePicker.nativeElement.showPicker();
  }

  clearRoster() {
    if (this.assignments().length === 0) return;
    this.showClearConfirmation.set(true);
  }

  confirmClearRoster() {
    this.showClearConfirmation.set(false);
    this.rosterService.clearRoster(this.selectedWeekStart()).subscribe({
      next: () => {
        this.assignments.set([]);
        this.toastr.success('Lista de servicio vaciada correctamente');
        this.loadRecentRosters();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Error al vaciar la lista')
    });
  }

  cloneFromPreviousRoster() {
    const history = this.recentRosters();
    const current = this.selectedWeekStart();

    // Buscar la fecha más reciente que sea anterior a la seleccionada actualmente
    const previousDates = history
      .map(d => d.split('T')[0])
      .filter(d => d < current)
      .sort((a, b) => b.localeCompare(a));

    if (previousDates.length === 0) {
      this.toastr.info('No se encontró ninguna lista de guardia previa en el sistema para clonar.');
      return;
    }

    this.cloneSourceDate = previousDates[0];
    this.showCloneConfirmation.set(true);
  }

  confirmCloneRoster() {
    this.showCloneConfirmation.set(false);
    this.isCloningRoster.set(true);
    
    this.rosterService.cloneRoster(this.cloneSourceDate, this.selectedWeekStart()).subscribe({
      next: () => {
        this.isCloningRoster.set(false);
        this.toastr.success('Guardia semanal clonada exitosamente');
        this.loadRoster();
        this.loadRecentRosters();
      },
      error: (err) => {
        this.isCloningRoster.set(false);
        this.toastr.error(err.error?.message || 'Error al clonar la guardia');
      }
    });
  }

  setupAgentSearch() {
    this.agentSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length < 2) return of({ agents: [], totalRecords: 0 });
        this.isSearchingAgents.set(true);
        return this.agentService.getAgents(1, 20, true).pipe(
          catchError(() => of({ agents: [], totalRecords: 0 }))
        );
      })
    ).subscribe(result => {
      this.searchAgentsResults.set(result.agents);
      this.isSearchingAgents.set(false);
    });
  }

  onSearchAgent(event: any) {
    this.agentSearchSubject.next(event.target.value);
  }

  selectAgent(agent: Agent) {
    this.selectedAgent.set(agent);
    this.searchAgentsResults.set([]);
  }

  assignAgent() {
    const agent = this.selectedAgent();
    const shiftId = Number(this.selectedShiftId());
    const postId = Number(this.selectedPostId());

    if (!agent || !shiftId || !postId) {
      this.toastr.warning('Por favor complete todos los campos');
      return;
    }

    if (this.assignments().some(a => a.agentId === agent.id)) {
      this.toastr.error(`El agente ${agent.fullName} ya tiene una asignación para esta semana.`);
      return;
    }

    if (this.assignments().some(a => a.shiftId === shiftId && a.dutyPostId === postId)) {
      this.toastr.error('Esta zona/puesto ya tiene un agente asignado para este turno en esta semana.');
      return;
    }

    this.isAssigning.set(true);
    const payload: any = {
      weekStartDate: this.selectedWeekStart(),
      agentId: agent.id,
      shiftId: shiftId,
      dutyPostId: postId
    };

    this.rosterService.assignAgent(payload).subscribe({
      next: (newAssignment) => {
        this.assignments.update(prev => [...prev, newAssignment]);
        this.toastr.success('Agente asignado exitosamente');
        this.resetAssignmentForm();
        this.isAssigning.set(false);
        this.loadRecentRosters();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al realizar la asignación');
        this.isAssigning.set(false);
      }
    });
  }

  removeAssignment(id: number) {
    this.rosterService.removeAssignment(id).subscribe({
      next: () => {
        this.assignments.update(prev => prev.filter(a => a.id !== id));
        this.toastr.info('Asignación removida');
      },
      error: (err) => this.toastr.error(err.error?.message || 'Error al remover asignación')
    });
  }

  requestCloseRoster() {
    if (this.assignments().length === 0) {
      this.toastr.warning('No hay asignaciones para cerrar la guardia');
      return;
    }
    this.showCloseConfirmation.set(true);
  }

  confirmCloseRoster() {
    this.showCloseConfirmation.set(false);
    this.isClosing.set(true);
    this.rosterService.closeRoster(this.selectedWeekStart()).subscribe({
      next: (status) => {
        this.isClosed.set(true);
        this.closedAt.set(status.closedAt || null);
        this.closedPreparer.set({ fullName: status.preparerName, rank: status.preparerRank, position: 'Sub-Encargado' });
        this.closedApprover.set({ fullName: status.approverName, rank: status.approverRank, position: 'Encargado' });
        this.isClosing.set(false);
        this.toastr.success('Guardia semanal cerrada y archivada correctamente');
        this.loadRecentRosters();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al cerrar la guardia');
        this.isClosing.set(false);
      }
    });
  }

  requestReopenRoster() {
    this.showReopenConfirmation.set(true);
  }

  confirmReopenRoster() {
    this.showReopenConfirmation.set(false);
    this.isReopening.set(true);
    this.rosterService.reopenRoster(this.selectedWeekStart()).subscribe({
      next: () => {
        this.isClosed.set(false);
        this.isReopening.set(false);
        this.toastr.info('La guardia semanal ha sido reabierta');
        this.loadRecentRosters();
      },
      error: () => {
        this.toastr.error('No se pudo reabrir');
        this.isReopening.set(false);
      }
    });
  }

  printRoster() {
    this.pdfService.generateDutyRosterPdf(
      this.selectedWeekStart(),
      this.assignments(),
      this.preparador(),
      this.aprobador(),
      'print'
    );
  }

  downloadRoster() {
    this.pdfService.generateDutyRosterPdf(
      this.selectedWeekStart(),
      this.assignments(),
      this.preparador(),
      this.aprobador(),
      'download'
    );
  }

  resetAssignmentForm() {
    this.selectedAgent.set(null);
    this.selectedShiftId.set(0);
    this.selectedPostId.set(0);
  }
}
