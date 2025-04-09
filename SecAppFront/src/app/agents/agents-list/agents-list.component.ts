import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-listado-agentes',
  imports: [UpperCasePipe, MatButtonModule, MatGridListModule, RouterLink ],
  templateUrl: './agents-list.component.html',
  styleUrl: './agents-list.component.css',
})
export class AgentsListComponent implements OnInit {
  agents: any[] = [];

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.getAgents();
    }, 3000);
  }

  getAgents() {
    this.apiService.getAgents().subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].photo.length === 0) {
          data[i].photo = 'DefaultAgent.jpg';
        }
      }
     this.agents = data;
    });
  }
}
