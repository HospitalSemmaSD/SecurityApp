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
import { NgxMaskDirective } from 'ngx-mask';

import { Router, RouterLink } from '@angular/router';
import { AgentCreateDto, AgentDto } from '../models/agent';
import { AgentServiceService } from '../agent-service.service';
import { InputImgComponent } from '../../shared/components/input-img/input-img.component';
import moment from 'moment';

@Component({
  selector: 'app-agent-form',
  standalone: true,
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
    NgxMaskDirective,
    RouterLink,
    InputImgComponent,
  ],
  templateUrl: './agent-form.component.html',
  styleUrl: './agent-form.component.css',
})
export class AgentFormComponent implements OnInit {
  ngOnInit(): void {
    if (this.model !== undefined) {
      console.log('Foto del agente:', this.model.photo);
      this.form.patchValue(this.model);
    }
  }
  constructor(private agentService: AgentServiceService) {}

  @Input()
  model?: AgentDto;

  @Output()
  formPost = new EventEmitter<AgentCreateDto>();

  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  selectedFile: File | null = null;

  ranges: any[] = [
    { id: 1, name: 'Raso' },
    { id: 2, name: 'Cabo' },
    { id: 3, name: 'Sargento' },
    { id: 4, name: 'Sargento Mayor' },
    { id: 5, name: 'Segundo Teniente' },
    { id: 6, name: 'Primer Teniente' },
    { id: 7, name: 'Capitán' },
    { id: 8, name: 'Mayor' },
    { id: 9, name: 'Teniente Coronel' },
    { id: 10, name: 'Coronel' },
    { id: 11, name: 'General de Brigada' },
    { id: 12, name: 'Mayor General' },
    { id: 13, name: 'Teniente General' },
  ];
  institutions: any[] = [
    { id: 1, name: 'Policia Nacional -PN-' },
    { id: 2, name: 'Fuerzas Armadas -FFAA-' },
  ];

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
    status: new FormControl<boolean>(true, {
      validators: [Validators.required],
    }),
    photo: new FormControl<File | string | null>(null),
    rangeId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    institutionId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    //agentId: new FormControl<number | null>(null),
    agentCode: new FormControl<number | null>(null),
  });

  onFileSelected(file: File): void {
    this.form.controls.photo.setValue(file);

    // from this is working with a service UpLoadFile on backend
    //Note: params is (event: Event) void
    // const fileInput = event.target as HTMLInputElement;
    // if (fileInput.files && fileInput.files.length > 0) {
    //   this.selectedFile = fileInput.files[0];
    // }
  }
  saveChange() {
    if (!this.form.valid) {
      return;
    }
    const agent = this.form.value as AgentCreateDto;
    agent.birthday = moment(agent.birthday).toDate();
    // if user don't chance photo for agent
    /* if (typeof agent.photo === 'string') {
      agent.photo  = undefined;
    }*/
    this.formPost.emit(agent);
  }
  // onSubmit() {
  //   console.log(this.selectedFile);

  //   if (this.selectedFile) {
  //     this.agentService.uploadImage(this.selectedFile).subscribe((resp) => {
  //       console.log(resp);
  //       const imageUrl = resp.imageUrl;
  //       this.form.patchValue({ photo: imageUrl });
  //       console.log('Imagen subida:', imageUrl);
  //     });
  //   }
  //   const formValue: AgentCreateDto = this.form.getRawValue();
  //   const agent: AgentCreateDto = {
  //     ...formValue,
  //   };

  //   this.saveChange();
  // }

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
