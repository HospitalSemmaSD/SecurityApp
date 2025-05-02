import { Component, Input, numberAttribute } from '@angular/core';
import { AgentFormComponent } from '../agent-form/agent-form.component';
import { AgentCreateDto, AgentDto } from '../../models/agent';

@Component({
  selector: 'app-edit-agent',
  imports: [AgentFormComponent],
  templateUrl: './edit-agent.component.html',
  styleUrl: './edit-agent.component.css',
})
export class EditAgentComponent {
  @Input({ transform: numberAttribute })
  agentId!: number;

  //agent to be edited example
  agent: AgentDto = {
    agentId: 5,
    name: 'Agent Name',
    lastName: 'Agent Last Name',
    phone: '8497825245',
    identification: '00100055896',
    email: 'agent@email.com',
    birthday: new Date(),
    status: true,
    photo: ' Agent Photo',
    agentCode: 12345,
    rangeId: 1,
    rangeName: 'Agent Range',
  };

  saveChange(agent: AgentCreateDto) {
    console.log('Editing agent', agent);
  }
}
