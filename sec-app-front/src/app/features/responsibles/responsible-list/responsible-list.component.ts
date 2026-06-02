import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Responsible } from '../../../core/models/responsible.model';
import { ResponsibleService } from '../../../core/services/responsible.service';
import { UiAlertComponent } from '../../../shared/components/ui-alert/ui-alert.component';

@Component({
  selector: 'app-responsible-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiAlertComponent],
  templateUrl: './responsible-list.component.html'
})
export class ResponsibleListComponent implements OnInit {
  private responsibleService = inject(ResponsibleService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  responsibles = signal<Responsible[]>([]);
  isLoadingData = signal(true);
  isSaving = signal(false);

  showDeleteAlert = signal(false);
  idToDelete = signal<number | null>(null);
  nameToDelete = signal('');
  editingId = signal<number | null>(null);

  form: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    rank: ['', [Validators.required, Validators.maxLength(50)]],
    position: ['', Validators.required]
  });

  ngOnInit() {
    this.loadResponsibles();
  }

  loadResponsibles() {
    this.isLoadingData.set(true);
    this.responsibleService.getResponsibles().subscribe({
      next: (data) => {
        this.responsibles.set(data);
        this.isLoadingData.set(false);
      },
      error: () => {
        this.toastr.error('Error al cargar responsables');
        this.isLoadingData.set(false);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isSaving.set(true);
    const editingIdValue = this.editingId();
    const payload = this.form.value;

    if (editingIdValue) {
      this.responsibleService.updateResponsible(editingIdValue, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.info('Responsable actualizado');
          this.cancelEdit();
          this.loadResponsibles();
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
      this.responsibleService.createResponsible(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.success('Responsable registrado');
          this.form.reset();
          this.loadResponsibles();
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

  onEdit(resp: Responsible) {
    this.editingId.set(resp.id);
    this.form.patchValue({
      fullName: resp.fullName,
      rank: resp.rank,
      position: resp.position
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset();
  }

  onDeleteRequest(resp: Responsible) {
    this.idToDelete.set(resp.id);
    this.nameToDelete.set(resp.fullName);
    this.showDeleteAlert.set(true);
  }

  confirmDelete() {
    const id = this.idToDelete();
    if (!id) return;

    this.responsibleService.deleteResponsible(id).subscribe({
      next: () => {
        this.toastr.warning('Responsable eliminado');
        this.showDeleteAlert.set(false);
        this.idToDelete.set(null);
        this.loadResponsibles();
      },
      error: () => this.toastr.error('Error al eliminar')
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
