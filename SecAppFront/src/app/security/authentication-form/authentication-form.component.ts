import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserCredentialsDTO } from '../userCredentialsDTO';
import { ShowErrorsComponent } from '../../shared/components/show-errors/show-errors.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-authentication-form',
  imports: [ShowErrorsComponent, ReactiveFormsModule, MatFormFieldModule,
    MatButtonModule, MatInputModule],
  templateUrl: './authentication-form.component.html',
  styleUrl: './authentication-form.component.css'
})
export class AuthenticationFormComponent {

  private formBuilder = inject(FormBuilder)
  form = this.formBuilder.group({
    email: ['', { validators: [Validators.required, Validators.email] }],
    password: ['', { validators: [Validators.required, Validators.minLength(6)] }],
  });

  @Input({ required: true })
  title!: string;
  @Input()
  errors: string[] = [];

  @Output()
  formPost = new EventEmitter<UserCredentialsDTO>();

  getErrorMessageEmail(): string {
    const field = this.form.controls.email;
    if (field?.hasError('email')) {
      return 'Introduzca un email valido';
    }
    if (field?.hasError('required')) {
      return 'Email es requerido';
    }
    return '';
  }

  getErrorMessagePassword(): string {
    const field = this.form.controls.email;
    if (field?.hasError('required')) {
      return 'Password es requerido';
    }
    return '';
  }

  saveChanges(): void {
    if (!this.form.valid) {
      return;
    }
    const credentials = this.form.value as UserCredentialsDTO;
    this.formPost.emit(credentials);


  }
}
