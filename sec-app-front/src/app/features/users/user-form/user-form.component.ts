import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  isLoading = signal(false);
  isEditMode = signal(false);
  currentUserId: string | null = null;
  errorMessage = signal('');
  availableRoles = signal<string[]>([]);

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]], 
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [
      Validators.required, 
      Validators.minLength(6)
    ]],
    role: ['', Validators.required],
    identification: ['', [Validators.required, Validators.minLength(11)]],
    email: ['', [Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit() {
    this.loadRoles();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.currentUserId = idParam;
      this.loadUserData(idParam);
      
      // En modo edición, el username es de solo lectura y el password no es obligatorio
      this.form.get('username')?.disable();
      this.form.get('password')?.setValidators([
        Validators.minLength(6)
      ]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  loadRoles() {
    this.userService.getAvailableRoles().subscribe({
      next: (roles) => this.availableRoles.set(roles),
      error: () => this.errorMessage.set('No se pudieron cargar los roles.')
    });
  }

  loadUserData(id: string) {
    this.isLoading.set(true);
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          username: user.userName,
          fullName: user.fullName,
          role: user.roles[0] || '',
          identification: user.identification,
          email: user.email,
          phoneNumber: user.phoneNumber
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar datos del usuario.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const userData = this.form.getRawValue();
    
    // Si la contraseña está vacía en modo edición, la eliminamos para no enviarla
    if (this.isEditMode() && !userData.password) {
      delete userData.password;
    }

    const request$ = this.isEditMode() && this.currentUserId
      ? this.userService.updateUser(this.currentUserId, userData)
      : this.userService.createUser(userData);

    request$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastr.success(`Usuario ${this.isEditMode() ? 'actualizado' : 'creado'} exitosamente`);
        this.router.navigate(['/app/users']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 400 && err.error) {
          if (err.error.errors) {
            this.mapServerErrors(err.error.errors);
            this.errorMessage.set('Error de validación: Verifica los campos ingresados.');
          } else {
            this.errorMessage.set(typeof err.error === 'string' 
              ? err.error 
              : err.error.detail || err.error.message || 'Error de validación: Verifica los campos ingresados.');
          }
        } else if (err.error && (err.error.detail || err.error.message)) {
          this.errorMessage.set(err.error.detail || err.error.message);
        } else {
          this.errorMessage.set('Ocurrió un error al procesar la solicitud.');
        }
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
