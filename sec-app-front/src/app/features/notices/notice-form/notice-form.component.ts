import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommunicationService } from '../../../core/services/communication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './notice-form.component.html'
})
export class NoticeFormComponent {
  private fb = inject(FormBuilder);
  private commsService = inject(CommunicationService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  noticeForm: FormGroup;
  isSaving = signal(false);

  constructor() {
    this.noticeForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
      isUrgent: [false],
      expirationDate: [null]
    });
  }

  onSubmit(): void {
    if (this.noticeForm.invalid) return;

    this.isSaving.set(true);
    this.commsService.createNotice(this.noticeForm.value).subscribe({
      next: () => {
        this.toastr.success('Comunicado publicado con éxito');
        this.router.navigate(['/app/home']);
      },
      error: (err) => {
        this.toastr.error(err.error?.detail || err.error?.message || 'Error al publicar comunicado');
        this.isSaving.set(false);
        if (err.status === 400 && err.error?.errors) {
          this.mapServerErrors(err.error.errors);
        }
      }
    });
  }

  private mapServerErrors(errors: any) {
    Object.keys(errors).forEach(field => {
      const control = this.noticeForm.get(field) 
        || this.noticeForm.get(field.toLowerCase())
        || this.noticeForm.get(field.charAt(0).toLowerCase() + field.slice(1));
      if (control) {
        control.setErrors({ serverError: errors[field][0] });
      }
    });
  }
}
