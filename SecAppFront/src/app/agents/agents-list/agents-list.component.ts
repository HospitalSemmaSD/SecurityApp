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
import { GenericListComponent } from '../../shared/components/generic-list/generic-list.component';
import { MatTableModule } from '@angular/material/table';
//import { MatFormFieldModule } from '@angular/material/form-field';
//import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-listado-agentes',
  imports: [
    UpperCasePipe,
    MatButtonModule,
    MatGridListModule,
    RouterLink,
    MatIcon,
    MatCardModule,
    MatDividerModule,
    GenericListComponent,
    MatTableModule,
  ],
  templateUrl: './agents-list.component.html',
  styleUrl: './agents-list.component.css',
})
export class AgentsListComponent implements OnInit {
  //constructor(private agentService: AgentServiceService) {} change to inject
  ngOnInit(): void {
    setTimeout(() => {}, 3000);
  }

  private agentService = inject(AgentServiceService);
  @Input({ required: true })
  agents: AgentDto[] = [];
  columnsToDisplay: string[] = [
    'AgentId',
    'Name',
    'Email',
    'Phone',
    'Photo',
    'Actions',
  ];

  constructor() {
    this.agentService.getAgents().subscribe((agents) => {
      this.agents = agents;
    });
  }
  // getAgents() {
  //   this.agentService.getAgents().subscribe((data: any) => {
  //     for (let i = 0; i < data.length; i++) {
  //       if (data[i].photo.length === 0) {
  //         data[i].photo = 'DefaultAgent.jpg';
  //       }
  //     }
  //     this.agents = data;
  //   });
  // }
}
