import { Component, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgentFilter } from '../../models/agentFilter';
import { AgentsListComponent } from '../agents-list/agents-list.component';
import { AgentServiceService } from '../agent-service.service';
import { AgentDto } from '../../models/agent';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agent-filter',
  imports: [
    MatButtonModule,

    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    AgentsListComponent,
  ],
  templateUrl: './agent-filter.component.html',
  styleUrl: './agent-filter.component.css',
})
export class AgentFilterComponent implements OnInit {
  ngOnInit(): void {
    this.getAgents();
    this.readURLValues();
    this.searchAgent(this.form.value as AgentFilter);
    this.form.valueChanges.subscribe((value) => {
      this.agentsFiltered = this.agents;
      this.searchAgent(value as AgentFilter);
      this.searchByURL(value as AgentFilter);
    });
  }

  // constructor(private agentService: AgentServiceService) {}
  private formBuilder = inject(FormBuilder);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private agentService = inject(AgentServiceService);

  @Output()
  agents: AgentDto[] = [];
  agentsFiltered: AgentDto[] = [];

  form = this.formBuilder.group({
    name: [''],
  });

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
  searchAgent(value: AgentFilter) {
    var query = value.name?.toLocaleLowerCase();

    if (value.name) {
      this.agentsFiltered = this.agentsFiltered.filter(
        (agent) =>
          agent.name?.toLocaleLowerCase().includes(query) ||
          agent.lastName?.toLocaleLowerCase().includes(query) ||
          agent.identification?.toLocaleLowerCase().includes(query)
      );
    }
  }

  clearFilter() {
    this.form.reset();
    this.agentsFiltered = this.agents;
    this.getAgents();
  }

  searchByURL(value: AgentFilter) {
    let queryStrings = [];
    if (value.name) {
      queryStrings.push(`name=${encodeURIComponent(value.name)}`);
    }
    //when i referesh the page, the filter is not applied
    this.location.replaceState('agents/filter', queryStrings.join('&'));
  }

  readURLValues() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      var object: any = {};
      if (params.name) {
        object.name = params.name;
      }
      this.form.patchValue(object);
    });
  }
}
