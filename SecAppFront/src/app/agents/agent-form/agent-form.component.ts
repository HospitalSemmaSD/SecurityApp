import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { RouterLink } from '@angular/router';
import { AgentDto } from '../../models/agent';

@Component({
  selector: 'app-agent-form',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './agent-form.component.html',
  styleUrl: './agent-form.component.css',
})
export class AgentFormComponent implements OnInit {
  ngOnInit(): void {
    if (this.model !== undefined) {
      this.form.patchValue({
        name: this.model.name,
        lastName: this.model.lastName,
        phone: this.model.phone,
        identification: this.model.identification,
        email: this.model.email,
        birthday: this.model.birthday,
        status: this.model.status,
        photo: this.model.photo,
        rangeId: this.model.rangeId,
        agentId: this.model.agentId,
      });
    }
  }

  @Input()
  model?: AgentDto;

  @Output()
  formPost = new EventEmitter<AgentDto>();

  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', { validators: [Validators.required] }],
    lastName: ['', { validators: [Validators.required] }],
    phone: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      },
    ],
    identification: ['', { validators: [Validators.required] }],
    email: ['', { validators: [Validators.email] }],
    birthday: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    status: new FormControl<boolean>(false, {
      validators: [Validators.required],
    }),
    photo: new FormControl<string | null>(null),
    rangeId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    agentId: new FormControl<number | null>(null),
  });

  saveChange() {
    if (!this.form.valid) {
      return;
    }
    const agent = this.form.value as AgentDto;
    console.log(agent);
    this.formPost.emit(agent);
  }

  errorName() {
    let name = this.form.controls.name;
    if (name.errors?.['required'] && name.touched) {
      return 'El campo nombre es requerido ';
    }
    return '';
  }
  errorLastName() {
    let lastName = this.form.controls.lastName;
    if (lastName.errors?.['required'] && lastName.touched) {
      return 'El campo apellido es requerido ';
    }
    return '';
  }
}
