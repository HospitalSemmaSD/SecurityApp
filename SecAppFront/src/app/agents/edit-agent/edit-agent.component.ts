import {
  Component,
  inject,
  Input,
  numberAttribute,
  OnInit,
} from '@angular/core';
import { AgentFormComponent } from '../agent-form/agent-form.component';
import { AgentCreateDto, AgentDto } from '../models/agent';
import { AgentServiceService } from '../agent-service.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ShowErrorsComponent } from '../../shared/components/show-errors/show-errors.component';
import { Router } from '@angular/router';
import { getErgetErrorsFromAPI } from '../../shared/funtions/getErrorsFromAPI';

@Component({
  selector: 'app-edit-agent',
  imports: [AgentFormComponent, LoadingComponent, ShowErrorsComponent],
  templateUrl: './edit-agent.component.html',
  styleUrl: './edit-agent.component.css',
})
export class EditAgentComponent implements OnInit {
  ngOnInit(): void {
    this.agentService.getAgentById(this.id).subscribe((agent) => {
      this.agent = agent;
      console.log('Agent fetched for editing:', this.agent);
    });
  }
  @Input({ transform: numberAttribute })
  id!: number;
  agent?: AgentDto;
  agentService = inject(AgentServiceService);
  errors: string[] = [];
  router = inject(Router);

  saveChange(agent: AgentCreateDto) {
    this.agentService.updateAgent(this.id, agent).subscribe({
      next: (response) => {
        console.log('Agent updated successfully:', response);
        this.router.navigate(['/agents']);
      },
      error: (error) => {
        const errors = getErgetErrorsFromAPI(error);
        this.errors = errors;
      },
    });
  }
}
