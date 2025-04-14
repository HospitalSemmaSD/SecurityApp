import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { AgentServiceService } from '../../services/agents/agent-service.service';

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
  ],
  templateUrl: './agents-list.component.html',
  styleUrl: './agents-list.component.css',
})
export class AgentsListComponent implements OnInit {
  agents: any[] = [];

  constructor(private agentService: AgentServiceService) {}
  ngOnInit(): void {
    this.getAgents();
    // setTimeout(() => {
    //   this.getAgents();
    // }, 3000);
  }

  getAgents() {
    this.agentService.getAgents().subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].photo.length === 0) {
          data[i].photo = 'DefaultAgent.jpg';
        }
      }
      this.agents = data;
      console.log(this.agents);
    });
  }
}
