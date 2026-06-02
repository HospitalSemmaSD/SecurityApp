import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginError: string = '';
  isLoading: boolean = false;

  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  getErrorMessageUsername(): string {
    const control = this.form.get('username');
    if (control?.hasError('required')) return 'El código/usuario es obligatorio.';
    return '';
  }

  getErrorMessagePassword(): string {
    const control = this.form.get('password');
    if (control?.hasError('required')) return 'La contraseña es obligatoria.';
    return '';
  }

  saveChanges() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.loginError = '';

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
this.router.navigate(['/app/home']);      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.loginError = 'Credenciales incorrectas. Verifique su código de empleado.';
        } else {
          this.loginError = 'Error de conexión con el servidor de seguridad.';
        }
      }
    });
  }
}