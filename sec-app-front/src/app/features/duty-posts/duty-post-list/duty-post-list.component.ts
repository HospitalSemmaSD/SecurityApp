import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DutyPost } from '../../../core/models/duty-post.model';
import { DutyPostService } from '../../../core/services/duty-post.service';
import { UiAlertComponent } from '../../../shared/components/ui-alert/ui-alert.component';

@Component({
  selector: 'app-duty-post-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiAlertComponent],
  templateUrl: './duty-post-list.component.html'
})
export class DutyPostListComponent implements OnInit {

  // POSITION MANAGEMENT LOGIC
  private dutyPostService = inject(DutyPostService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  posts = signal<DutyPost[]>([]);
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
    this.loadPosts();
  }

  loadPosts() {
    this.isLoadingData.set(true);
    this.dutyPostService.getDutyPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Error cargando puestos', err);
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
      this.dutyPostService.updateDutyPost(editingIdValue, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.info('Puesto actualizado correctamente');
          this.cancelEdit();
          this.loadPosts();
        },
        error: (err) => {
          this.toastr.error(err.error?.detail || err.error?.message || 'Error al actualizar el puesto');
          this.isSaving.set(false);
          if (err.status === 400 && err.error?.errors) {
            this.mapServerErrors(err.error.errors);
          }
        }
      });
    } else {
      this.dutyPostService.createDutyPost(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastr.success('Puesto registrado correctamente');
          this.form.reset();
          this.loadPosts();
        },
        error: (err) => {
          this.toastr.error(err.error?.detail || err.error?.message || 'Error al guardar el puesto');
          this.isSaving.set(false);
          if (err.status === 400 && err.error?.errors) {
            this.mapServerErrors(err.error.errors);
          }
        }
      });
    }
  }

  onEdit(post: DutyPost) {
    this.editingId.set(post.id);
    this.form.patchValue({ name: post.name });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset();
  }

  onDeleteRequest(post: DutyPost) {
    this.idToDelete.set(post.id);
    this.nameToDelete.set(post.name);
    this.showDeleteAlert.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmDelete() {
    const id = this.idToDelete();
    if (!id) return;

    this.dutyPostService.deleteDutyPost(id).subscribe({
      next: () => {
        this.toastr.warning('El puesto ha sido eliminado');
        this.showDeleteAlert.set(false);
        this.idToDelete.set(null);
        this.loadPosts();
      },
      error: () => {
        this.toastr.error('No se pudo eliminar el puesto');
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
