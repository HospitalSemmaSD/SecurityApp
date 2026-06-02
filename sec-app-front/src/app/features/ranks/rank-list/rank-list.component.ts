import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Institution } from '../../../core/models/institution.model';
import { Rank } from '../../../core/models/rank.model';
import { InstitutionService } from '../../../core/services/institution.service';
import { RankService } from '../../../core/services/rank.service';
import { UiAlertComponent } from '../../../shared/components/ui-alert/ui-alert.component';

@Component({
  selector: 'app-rank-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiAlertComponent],
  templateUrl: './rank-list.component.html'
})
export class RankListComponent implements OnInit {
  private rankService = inject(RankService);
  private institutionService = inject(InstitutionService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  ranks = signal<Rank[]>([]);
  institutions = signal<Institution[]>([]);
  isLoadingData = signal(true);
  isSaving = signal(false);
  showDeleteAlert = signal(false);
  idToDelete = signal<number | null>(null);
  nameToDelete = signal('');
  editingId = signal<number | null>(null);

  groupedRanks = computed(() => {
    const allRanks = this.ranks();
    const groups = allRanks.reduce((acc, rank) => {
      const key = rank.institutionName || 'Sin Institución';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(rank);
      return acc;
    }, {} as { [key: string]: Rank[] });

    return Object.keys(groups).map(key => ({
      institutionName: key,
      ranks: groups[key]
    }));
  });

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    institutionId: ['', [Validators.required]]
  });

  ngOnInit() {
    this.loadInstitutions();
    this.loadRanks();
  }

  loadInstitutions() {
    this.institutionService.getInstitutions().subscribe({
      next: (data) => this.institutions.set(data),
      error: () => this.toastr.error('Error al cargar catálogo de instituciones')
    });
  }

  loadRanks() {
    this.isLoadingData.set(true);
    this.rankService.getRanks().subscribe({
      next: (data) => {
        this.ranks.set(data);
        this.isLoadingData.set(false);
      },
      error: () => {
        this.toastr.error('Error al cargar rangos');
        this.isLoadingData.set(false);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSaving.set(true);

    const editingIdValue = this.editingId();
    const payload = {
      id: editingIdValue || 0,
      name: this.form.get('name')?.value,
      institutionId: Number(this.form.get('institutionId')?.value)
    };

    if (editingIdValue) {
      this.rankService.updateRank(editingIdValue, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.info('Rango actualizado');
          this.cancelEdit();
          this.loadRanks();
        },
        error: (err) => {
          this.toastr.error(err.error?.detail || err.error?.message || 'Error al actualizar');
          this.isSaving.set(false);
          if (err.status === 400 && err.error?.errors) {
            this.mapServerErrors(err.error.errors);
          }
        }
      });
    } else {
      this.rankService.createRank(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.success('Rango registrado');
          this.form.reset({ name: '', institutionId: '' });
          this.loadRanks();
        },
        error: (err) => {
          this.toastr.error(err.error?.detail || err.error?.message || 'Error al guardar');
          this.isSaving.set(false);
          if (err.status === 400 && err.error?.errors) {
            this.mapServerErrors(err.error.errors);
          }
        }
      });
    }
  }

  onEdit(rank: Rank) {
    this.editingId.set(rank.id);
    this.form.patchValue({
      name: rank.name,
      institutionId: rank.institutionId
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset({ name: '', institutionId: '' });
  }

  onDeleteRequest(rank: Rank) {
    this.idToDelete.set(rank.id);
    this.nameToDelete.set(rank.name);
    this.showDeleteAlert.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmDelete() {
    const id = this.idToDelete();
    if (!id) return;
    this.rankService.deleteRank(id).subscribe({
      next: () => {
        this.toastr.warning('Rango eliminado');
        this.showDeleteAlert.set(false);
        this.idToDelete.set(null);
        this.loadRanks();
      },
      error: () => {
        this.toastr.error('Error al eliminar');
        this.showDeleteAlert.set(false);
      }
    });
  }

  private mapServerErrors(errors: any) {
    Object.keys(errors).forEach(field => {
      const control = this.form.get(field) 
        || this.form.get(field.toLowerCase())
        || this.form.get(field.charAt(0).toLowerCase() + field.slice(1));
      if (control) {
        control.setErrors({ serverError: errors[field][0] });
      }
    });
  }
}
