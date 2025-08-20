import { Component, inject } from '@angular/core';
import { AgentFormComponent } from '../agent-form/agent-form.component';
import { AgentCreateDto } from '../models/agent';
import { AgentServiceService } from '../agent-service.service';
import { Router } from '@angular/router';
import { getErrorsFromAPI } from '../../shared/funtions/getErrorsFromAPI';
import { ShowErrorsComponent } from '../../shared/components/show-errors/show-errors.component';

@Component({
  selector: 'app-create-gent',
  imports: [AgentFormComponent, ShowErrorsComponent],
  templateUrl: './create-agent.component.html',
  styleUrl: './create-agent.component.css',
})
export class CreateAGentComponent {
  private router = inject(Router);
  private agentService = inject(AgentServiceService);
  errors: string[] = [];

  saveChange(agent: AgentCreateDto) {
    this.agentService.create(agent).subscribe({
      next: (data) => {
        console.log('Agent created successfully:', data);
        this.router.navigate(['/agents']);
      },
      error: (err) => {
        console.error('Error creating agent:', err);
        const errors = getErrorsFromAPI(err);
        this.errors = errors;
      },
    });
  }
}
function getErrors() {
  throw new Error('Function not implemented.');
}
