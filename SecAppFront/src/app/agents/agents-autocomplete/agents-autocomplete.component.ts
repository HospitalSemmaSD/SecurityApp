import { Component, ViewChild } from '@angular/core';
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
export class AgentsAutocompleteComponent {
  agentControl = new FormControl();
  agents: AgentAutoCompleDto[] = [
    {
      id: 1,
      name: 'Welinton Aleiner',
      lastName: 'Gonzalez',
      phone: `+593 99 999 9999`,
      photo: `https://i.pravatar.cc/150?img=1`,
    },
    {
      id: 2,
      name: 'John',
      lastName: 'Doe',
      phone: `+593 99 999 9999`,
      photo: `https://i.pravatar.cc/150?img=2`,
    },
    {
      id: 3,
      name: 'Jane',
      lastName: 'Smith',
      phone: `+593 99 999 9999`,
      photo: `https://i.pravatar.cc/150?img=3`,
    },
    {
      id: 4,
      name: 'Alice',
      lastName: 'Johnson',
      phone: `+593 99 999 9999`,
      photo: `https://i.pravatar.cc/150?img=4`,
    },
    {
      id: 5,
      name: 'Bob',
      lastName: 'Brown',
      phone: `+593 99 999 9999`,
      photo: `https://i.pravatar.cc/150?img=5`,
    },
  ];

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
