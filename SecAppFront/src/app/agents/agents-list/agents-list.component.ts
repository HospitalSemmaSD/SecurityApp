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
import { HttpResponse } from '@angular/common/http';
import { PaginationDTO } from '../../shared/models/paginationDTO';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
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
    MatPaginatorModule,
    SweetAlert2Module,
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
  pagination: PaginationDTO = { page: 1, recordsPerPage: 10 };
  totalCount!: number;
  constructor() {
    this.getAgents();
  }

  getAgents() {
    this.agentService
      .getAgentsPagedList(this.pagination)
      .subscribe((response: HttpResponse<AgentDto[]>) => {
        this.agents = response.body as [];
        const header = response.headers.get('totalCount') as string;
        this.totalCount = parseInt(header, 10);
      });
  }

  onPaginateChange(data: PageEvent) {
    this.pagination = {
      page: data.pageIndex + 1, // PageEvent is zero-based
      recordsPerPage: data.pageSize,
    };
    this.getAgents();
  }

  deleteAgent(id: number) {
    this.agentService.deleteAgent(id).subscribe({
      next: () => {
        this.getAgents();
      },
    });
  }
}
