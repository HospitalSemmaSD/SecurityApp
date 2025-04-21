import { Component, inject } from '@angular/core';
import { AgentFormComponent } from '../agent-form/agent-form.component';
import { AgentDto } from '../../models/agent';
import { AgentServiceService } from '../../services/agents/agent-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-gent',
  imports: [AgentFormComponent],
  templateUrl: './create-agent.component.html',
  styleUrl: './create-agent.component.css',
})
export class CreateAGentComponent {
  private router = inject(Router);
  constructor(private agentService: AgentServiceService) {}
  saveChange(agent: AgentDto) {
    console.log('Agent to be created:', agent);
    this.agentService.createAgent(agent).subscribe((data) => {
      // Optionally, navigate to another page or show a success message
      this.router.navigate(['/agents']);
    });
  }
}
