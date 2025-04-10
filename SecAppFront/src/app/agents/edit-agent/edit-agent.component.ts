import { Component, Input } from '@angular/core';
import { AgentFormComponent } from '../agent-form/agent-form.component';
import { AgentDto } from '../../models/agent';

@Component({
  selector: 'app-edit-agent',
  imports: [AgentFormComponent],
  templateUrl: './edit-agent.component.html',
  styleUrl: './edit-agent.component.css',
})

@Input({transform: Date}
  birthday: Date;
)
export class EditAgentComponent {
  saveChange(agent: AgentDto) {
    console.log(agent);
  }
}
