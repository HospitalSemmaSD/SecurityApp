import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { UserCredentialsDTO } from '../userCredentialsDTO';
import { getErrorsIdentity } from '../../shared/funtions/getErrorsFromAPI';
import { AuthenticationFormComponent } from "../authentication-form/authentication-form.component";

@Component({
  selector: 'app-singup',
  imports: [AuthenticationFormComponent],
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.css'
})
export class SingupComponent {
  // isLoading = false;
  // errorMessage = '';
  
  constructor(
    // private fb: FormBuilder,
    // private authService: AuthService,
    
  ) {}
  //  private readonly formBuilder = inject(FormBuilder);
  private readonly securityService = inject(SecurityService); 
  private readonly router = inject(Router);
  errors: string[] = [];

  // form = this.formBuilder.group({
  //   codigo: ['', { validators: [Validators.required] }],
  //   password: ['', { validators: [Validators.required] }],
  // });

    signUp(credentials: UserCredentialsDTO) {
      this.securityService.signUp(credentials).subscribe({
        next: (response) => {        
          const token = response.token;          
          this.router.navigate(['agents']); 
        },
        error: (err) => {
          const errors = getErrorsIdentity(err);          
          this.errors = errors;
        },
      });
  
    }

}
