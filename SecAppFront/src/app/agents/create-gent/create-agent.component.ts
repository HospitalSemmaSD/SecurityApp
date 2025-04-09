import { Component, inject } from '@angular/core';
import { AgentFormComponent } from '../agent-form/agent-form.component';
import { AgentCreateDto } from '../../models/agent';

@Component({
  selector: 'app-create-gent',
  imports: [AgentFormComponent],
  templateUrl: './create-agent.component.html',
  styleUrl: './create-agent.component.css',
})
export class CreateAGentComponent {
  //private router = inject(Router);

  saveChange(agent: AgentCreateDto) {
    console.log('from create agent' + agent);
  }
}
