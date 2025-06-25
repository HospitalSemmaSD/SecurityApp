import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { AgentAutoCompleDto } from '../models/agent';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AgentServiceService } from '../agent-service.service';

@Component({
  selector: 'app-agents-autocomplete',
  imports: [
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    DragDropModule,
  ],
  templateUrl: './agents-autocomplete.component.html',
  styleUrl: './agents-autocomplete.component.css',
})
export class AgentsAutocompleteComponent implements OnInit {
  ngOnInit(): void {
    this.agentControl.valueChanges.subscribe((value) => {
      if (typeof value === 'string' && value) {
        this.agentService
          .getByName(value)
          .subscribe((agents) => (this.agents = agents));
      }
    });
  }

  agentControl = new FormControl();
  agents: AgentAutoCompleDto[] = [];
  agentService = inject(AgentServiceService);
  agentsSelected: AgentAutoCompleDto[] = [];
  columnstoDisplay: string[] = [
    'photo',
    'name',
    'lastName',
    'phone',
    'actions',
  ];
  @ViewChild(MatTable) table!: MatTable<AgentAutoCompleDto>;
  agentSelected(event: MatAutocompleteSelectedEvent) {
    this.agentsSelected.push(event.option.value);
    this.agentControl.patchValue('');
    if (this.table !== undefined) {
      this.table.renderRows();
    }
  }
  drop(event: CdkDragDrop<any>) {
    const previousIndex = this.agentsSelected.findIndex(
      (d) => d === event.item.data
    );
    moveItemInArray(this.agentsSelected, previousIndex, event.currentIndex);
    this.table.renderRows();
  }
  removeAgent(agent: AgentAutoCompleDto) {
    const index = this.agentsSelected.indexOf(agent);
    if (index >= 0) {
      this.agentsSelected.splice(index, 1);
      if (this.table !== undefined) {
        this.table.renderRows();
      }
    }
  }
}
