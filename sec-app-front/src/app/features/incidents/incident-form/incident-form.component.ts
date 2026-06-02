import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommunicationService } from '../../../core/services/communication.service';
import { ShiftService } from '../../../core/services/shift.service';
import { DutyPostService } from '../../../core/services/duty-post.service';
import { Shift } from '../../../core/models/shift.model';
import { DutyPost } from '../../../core/models/duty-post.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './incident-form.component.html'
})
export class IncidentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private commsService = inject(CommunicationService);
  private shiftService = inject(ShiftService);
  private postService = inject(DutyPostService);
  private toastr = inject(ToastrService);

  incidentForm: FormGroup;
  shifts = signal<Shift[]>([]);
  posts = signal<DutyPost[]>([]);
  isSaving = signal(false);

  constructor() {
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      severity: ['Low', Validators.required],
      shiftId: [null],
      dutyPostId: [null]
    });
  }

  ngOnInit(): void {
    this.shiftService.getShifts().subscribe(data => this.shifts.set(data));
    this.postService.getDutyPosts().subscribe(data => this.posts.set(data));
  }

  onSubmit(): void {
    if (this.incidentForm.invalid) return;

    this.isSaving.set(true);
    this.commsService.createIncident(this.incidentForm.value).subscribe({
      next: () => {
        this.toastr.success('Novedad reportada correctamente');
        this.router.navigate(['/app/home']);
      },
      error: (err) => {
        this.toastr.error(err.error?.detail || err.error?.message || 'Error al reportar novedad');
        this.isSaving.set(false);
        if (err.status === 400 && err.error?.errors) {
          this.mapServerErrors(err.error.errors);
        }
      }
    });
  }

  private mapServerErrors(errors: any) {
    Object.keys(errors).forEach(field => {
      const control = this.incidentForm.get(field) 
        || this.incidentForm.get(field.toLowerCase())
        || this.incidentForm.get(field.charAt(0).toLowerCase() + field.slice(1));
      if (control) {
        control.setErrors({ serverError: errors[field][0] });
      }
    });
  }
}
