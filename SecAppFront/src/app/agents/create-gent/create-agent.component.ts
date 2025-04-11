import { Component, inject } from '@angular/core';
import { AgentFormComponent } from '../agent-form/agent-form.component';
import { AgentCreateDto } from '../../models/agent';
import { AgentServiceService } from '../../services/agents/agent-service.service';

@Component({
  selector: 'app-create-gent',
  imports: [AgentFormComponent],
  templateUrl: './create-agent.component.html',
  styleUrl: './create-agent.component.css',
})
export class CreateAGentComponent {
  //private router = inject(Router);
  constructor(private agentService: AgentServiceService) {}
  saveChange(agent: AgentCreateDto) {
    this.agentService.createAgent(agent).subscribe((data) => {
      console.log('Agent created successfully:', data);
      // Optionally, navigate to another page or show a success message
      // this.router.navigate(['/agents']);
    });
  }
}
