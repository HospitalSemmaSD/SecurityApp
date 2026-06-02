import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AgentService } from '../../../core/services/agent.service';
import { InstitutionService } from '../../../core/services/institution.service';
import { RankService } from '../../../core/services/rank.service';
import { ShiftService } from '../../../core/services/shift.service';
import { DutyPostService } from '../../../core/services/duty-post.service';
import { FormDataUtil } from '../../../core/utils/form-data.util';

import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { Institution } from '../../../core/models/institution.model';
import { Rank } from '../../../core/models/rank.model';
import { Shift } from '../../../core/models/shift.model';
import { DutyPost } from '../../../core/models/duty-post.model';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxMaskDirective, FormsModule],
  templateUrl: './agent-form.component.html'
})
export class AgentFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private agentService = inject(AgentService);
  private institutionService = inject(InstitutionService);
  private rankService = inject(RankService);
  private shiftService = inject(ShiftService);
  private postService = inject(DutyPostService);
  private toastr = inject(ToastrService);

  isEditMode = false;
  currentAgentId: number | null = null;
  fotoSeleccionada: File | null = null;
  imagePreview = signal<string | null>(null);

  isLoading = signal(false);
  errorMessage = signal('');
  institutions = signal<Institution[]>([]);
  filteredRanks = signal<Rank[]>([]);
  shifts = signal<Shift[]>([]);
  posts = signal<DutyPost[]>([]);

  weekDays = [
    { id: '1', name: 'Lun' },
    { id: '2', name: 'Mar' },
    { id: '3', name: 'Mié' },
    { id: '4', name: 'Jue' },
    { id: '5', name: 'Vie' },
    { id: '6', name: 'Sáb' },
    { id: '0', name: 'Dom' }
  ];

  selectedDays: string[] = [];

  form: FormGroup = this.fb.group({
    agentCode: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required]],
    identification: ['', [Validators.required, Validators.minLength(11)]],
    birthDay: ['', [Validators.required]],
    email: ['', [Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    address: [''],
    institutionId: ['', [Validators.required]],
    rankId: [{ value: '', disabled: true }, [Validators.required]],
    gender: ['M', [Validators.required]],
    status: [true, [Validators.required]],
    workDays: [''],
    defaultShiftId: [null],
    defaultDutyPostId: [null]
  });

  ngOnInit() {
    this.loadInstitutions();
    this.loadShifts();
    this.loadPosts();

    this.form.get('institutionId')?.valueChanges.subscribe(instId => {
      if (instId) {
        this.loadRanks(Number(instId));
      }
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.currentAgentId = +idParam;
      this.loadAgentData(this.currentAgentId);
    }
  }

  loadInstitutions() {
    this.institutionService.getInstitutions().subscribe({
      next: (data) => this.institutions.set(data),
      error: (err) => console.error('Error cargando instituciones', err)
    });
  }

  loadShifts() {
    this.shiftService.getShifts().subscribe(data => this.shifts.set(data));
  }

  loadPosts() {
    this.postService.getDutyPosts().subscribe(data => this.posts.set(data));
  }

  loadRanks(institutionId: number) {
    this.form.get('rankId')?.setValue('');
    this.form.get('rankId')?.disable();
    this.rankService.getRanksByInstitution(institutionId).subscribe({
      next: (ranks) => {
        this.filteredRanks.set(ranks);
        this.form.get('rankId')?.enable();
      },
      error: (err) => console.error('Error cargando rangos', err)
    });
  }

  toggleDay(dayId: string) {
    const index = this.selectedDays.indexOf(dayId);
    if (index === -1) {
      this.selectedDays.push(dayId);
    } else {
      this.selectedDays.splice(index, 1);
    }
    this.form.get('workDays')?.setValue(this.selectedDays.join(','));
  }

  isDaySelected(dayId: string): boolean {
    return this.selectedDays.includes(dayId);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoSeleccionada = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  loadAgentData(id: number) {
    this.isLoading.set(true);
    this.agentService.getAgentById(id).subscribe({
      next: (agent) => {
        this.rankService.getRanksByInstitution(agent.institutionId).subscribe({
          next: (ranks) => {
            this.filteredRanks.set(ranks);
            this.form.get('rankId')?.enable();

            const formattedDate = this.formatDateForMask(agent.birthDay);
            
            if (agent.workDays) {
              this.selectedDays = agent.workDays.split(',');
            }

            this.form.patchValue({
              ...agent,
              birthDay: formattedDate
            }, { emitEvent: false });

            if (agent.photo) {
              const path = agent.photo.startsWith('/') ? agent.photo.substring(1) : agent.photo;
              this.imagePreview.set(`${environment.apiUrl.replace('/api', '')}/${path}`);
            }

            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar datos del agente.');
        this.isLoading.set(false);
      }
    });
  }

  private formatDateForMask(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formData = FormDataUtil.toFormData(this.form.getRawValue(), 'photo', this.fotoSeleccionada);

    const request$ = this.isEditMode && this.currentAgentId
      ? this.agentService.updateAgent(this.currentAgentId, formData)
      : this.agentService.createAgent(formData);

    request$.subscribe({
      next: () => {
        this.toastr.success(this.isEditMode ? 'Agente actualizado' : 'Agente registrado');
        this.router.navigate(['/app/agents']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 0) {
          this.errorMessage.set('No se pudo conectar con el servidor.');
          return;
        }
        if (err.status === 400 && err.error?.errors) {
          this.mapServerErrors(err.error.errors);
        } else {
          this.errorMessage.set(err.error?.detail || err.error?.message || err.error?.title || 'Error inesperado');
        }
      }
    });
  }

  private mapServerErrors(errors: any) {
    Object.keys(errors).forEach(field => {
      const control = this.form.get(field) || this.form.get(field.toLowerCase());
      if (control) {
        control.setErrors({ serverError: errors[field][0] });
      }
    });
  }
}
