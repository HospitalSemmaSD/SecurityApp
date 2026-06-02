import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Shift } from '../../../core/models/shift.model';
import { ShiftService } from '../../../core/services/shift.service';
import { UiAlertComponent } from '../../../shared/components/ui-alert/ui-alert.component';

@Component({
  selector: 'app-shift-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiAlertComponent],
  templateUrl: './shift-list.component.html'
})
export class ShiftListComponent implements OnInit {
  private shiftService = inject(ShiftService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  shifts = signal<Shift[]>([]);
  isLoadingData = signal(true);
  isSaving = signal(false);

  showDeleteAlert = signal(false);
  idToDelete = signal<number | null>(null);
  nameToDelete = signal('');
  editingId = signal<number | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });

  ngOnInit() {
    this.loadShifts();
  }

  loadShifts() {
    this.isLoadingData.set(true);
    this.shiftService.getShifts().subscribe({
      next: (data) => {
        this.shifts.set(data);
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Error cargando turnos', err);
        this.toastr.error('Error al cargar datos del servidor');
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
      this.shiftService.updateShift(editingIdValue, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.info('Turno actualizado correctamente');
          this.cancelEdit();
          this.loadShifts();
        },
        error: (err) => {
          this.toastr.error(err.error?.detail || err.error?.message || 'Error al actualizar el turno');
          this.isSaving.set(false);
          if (err.status === 400 && err.error?.errors) {
            this.mapServerErrors(err.error.errors);
          }
        }
      });
    } else {
      this.shiftService.createShift(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.success('Turno registrado correctamente');
          this.form.reset();
          this.loadShifts();
        },
        error: (err) => {
          this.toastr.error(err.error?.detail || err.error?.message || 'Error al guardar el turno');
          this.isSaving.set(false);
          if (err.status === 400 && err.error?.errors) {
            this.mapServerErrors(err.error.errors);
          }
        }
      });
    }
  }

  onEdit(shift: Shift) {
    this.editingId.set(shift.id);
    this.form.patchValue({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset();
  }

  onDeleteRequest(shift: Shift) {
    this.idToDelete.set(shift.id);
    this.nameToDelete.set(shift.name);
    this.showDeleteAlert.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmDelete() {
    const id = this.idToDelete();
    if (!id) return;

    this.shiftService.deleteShift(id).subscribe({
      next: () => {
        this.toastr.warning('El turno ha sido eliminado');
        this.showDeleteAlert.set(false);
        this.idToDelete.set(null);
        this.loadShifts();
      },
      error: () => {
        this.toastr.error('No se pudo eliminar el turno');
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
