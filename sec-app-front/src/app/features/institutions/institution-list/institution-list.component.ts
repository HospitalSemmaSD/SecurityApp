import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Institution } from '../../../core/models/institution.model';
import { InstitutionService } from '../../../core/services/institution.service';
import { UiAlertComponent } from '../../../shared/components/ui-alert/ui-alert.component';

@Component({
  selector: 'app-institution-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiAlertComponent],
  templateUrl: './institution-list.component.html'
})
export class InstitutionListComponent implements OnInit {
  private institutionService = inject(InstitutionService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  // Signals para el estado
  institutions = signal<Institution[]>([]);
  isLoadingData = signal(true);
  isSaving = signal(false);

  showDeleteAlert = signal(false);
  idToDelete = signal<number | null>(null);
  nameToDelete = signal('');
  editingId = signal<number | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]]
  });

  ngOnInit() {
    this.loadInstitutions();
  }

  loadInstitutions() {
    this.isLoadingData.set(true);
    this.institutionService.getInstitutions().subscribe({
      next: (data) => {
        this.institutions.set(data);
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Error cargando instituciones', err);
        this.toastr.error('Error al cargar datos del servidor');
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
      name: this.form.get('name')?.value
    };

    if (editingIdValue) {
      this.institutionService.updateInstitution(editingIdValue, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.info('Los datos fueron actualizados', 'Institución Actualizada');
          this.cancelEdit(); 
          this.loadInstitutions();
        },
        error: (err) => {
          this.toastr.error(err.error?.detail || err.error?.message || 'Ocurrió un error al actualizar', 'Error');
          this.isSaving.set(false);
          if (err.status === 400 && err.error?.errors) {
            this.mapServerErrors(err.error.errors);
          }
        }
      });
    } else {
      this.institutionService.createInstitution(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.success('Institución registrada exitosamente', '¡Éxito!');
          this.form.reset();
          this.loadInstitutions();
        },
        error: (err) => {
          this.toastr.error(err.error?.detail || err.error?.message || 'Fallo al guardar');
          this.isSaving.set(false);
          if (err.status === 400 && err.error?.errors) {
            this.mapServerErrors(err.error.errors);
          }
        }
      });
    }
  }

  onEdit(institution: Institution) {
    this.editingId.set(institution.id); 
    this.form.patchValue({ name: institution.name });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset();
  }
  
  onDeleteRequest(institution: Institution) {
    this.idToDelete.set(institution.id);
    this.nameToDelete.set(institution.name);
    this.showDeleteAlert.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmDelete() {
    const id = this.idToDelete();
    if (!id) return;

    this.institutionService.deleteInstitution(id).subscribe({
      next: () => {
        this.toastr.warning('La institución ha sido eliminada', 'Registro Eliminado');
        this.showDeleteAlert.set(false);
        this.idToDelete.set(null);
        this.loadInstitutions();
      },
      error: (err) => {
        this.toastr.error('No se pudo eliminar el registro', 'Error');
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
