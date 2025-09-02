import { Component, inject, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserCredentialsDTO } from '../userCredentialsDTO';
import { SecurityService } from '../security.service';
import { getErrorsIdentity } from '../../shared/funtions/getErrorsFromAPI';
import { AuthenticationFormComponent } from "../authentication-form/authentication-form.component";
@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    AuthenticationFormComponent
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
    // Aquí puedes agregar lógica adicional si es necesario
  }

  // isLoading = false;
  // errorMessage = '';
  
  constructor(
    // private fb: FormBuilder,
    // private authService: AuthService,
    
  ) {}
  //private readonly formBuilder = inject(FormBuilder);
  private readonly securityService = inject(SecurityService); 
  private readonly router = inject(Router);
  errors: string[] = [];
  
  

  // form = this.formBuilder.group({
  //   codigo: ['', { validators: [Validators.required] }],
  //   password: ['', { validators: [Validators.required] }],
  // });

  login(credentials: UserCredentialsDTO) {
    this.securityService.login(credentials).subscribe({
      next: () => {        
        //const token = response.token;
        this.router.navigate(['agents']); 
      },
      error: (err) => {
        const errors = getErrorsIdentity(err);
        console.error('Login failed', errors);
        this.errors = errors;
      },
    });

  }
  // onSubmit() {
  //   if (this.form.invalid) {
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.errorMessage = '';

  
  
  // }

  // errorCodigo() {
  //   let codigo = this.form.controls.codigo;
  //   if (codigo.errors?.['required'] && codigo.touched) {
  //     return 'Codigo necesario ';
  //   }
  //   return '';
  // }
  // errorPassword() {
  //   let pass = this.form.controls.password;
  //   if (pass.errors?.['required'] && pass.touched) {
  //     return 'Necesitas una contraseña';
  //   }
  //   return '';
  // }
}
