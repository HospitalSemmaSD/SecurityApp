import { Component, inject, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
    // Aquí puedes agregar lógica adicional si es necesario
  }

  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    codigo: ['', { validators: [Validators.required] }],
    password: ['', { validators: [Validators.required] }],
  });
  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // this.authService.login(username, password).subscribe({
    //   next: () => {
    //     this.router.navigate(['/dashboard']); // Ajusta la ruta según tu aplicación
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this.errorMessage = err.message || 'Error al iniciar sesión';
    //   },
    // });
  }

  errorCodigo() {
    let codigo = this.form.controls.codigo;
    if (codigo.errors?.['required'] && codigo.touched) {
      return 'Codigo necesario ';
    }
    return '';
  }
  errorPassword() {
    let pass = this.form.controls.password;
    if (pass.errors?.['required'] && pass.touched) {
      return 'Necesitas una contraseña';
    }
    return '';
  }
}
