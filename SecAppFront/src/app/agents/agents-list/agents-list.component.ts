import { Component, inject, Input, OnInit } from '@angular/core';
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { AgentServiceService } from '../agent-service.service';
import { AgentDto } from '../models/agent';
//import { MatFormFieldModule } from '@angular/material/form-field';
//import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-listado-agentes',
  imports: [
    UpperCasePipe,
    DatePipe,
    MatButtonModule,
    MatGridListModule,
    NgClass,
    RouterLink,
    MatIcon,
    MatCardModule,
    MatDividerModule,
    //MatFormFieldModule,
    // MatInputModule,
  ],
  templateUrl: './agents-list.component.html',
  styleUrl: './agents-list.component.css',
})
export class AgentsListComponent implements OnInit {
  //constructor(private agentService: AgentServiceService) {} change to inject
  ngOnInit(): void {
    setTimeout(() => {
      this.getAgents();
    }, 3000);
  }

  @Input({ required: true })
  agents: AgentDto[] = [];

  private agentService = inject(AgentServiceService);

  getAgents() {
    this.agentService.getAgents().subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].photo.length === 0) {
          data[i].photo = 'DefaultAgent.jpg';
        }
      }
      this.agents = data;
    });
  }
}
