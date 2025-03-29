import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listado-agentes',
  imports: [UpperCasePipe,MatButtonModule],
  templateUrl: './listado-agentes.component.html',
  styleUrl: './listado-agentes.component.css'
})
export class ListadoAgentesComponent implements OnInit  {
  agents: any[] = [];

constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    setTimeout(() => {      
      this.getAgents();
    }, 3000);
  }

  getAgents() {
    this.apiService.getSecurity().subscribe((data: any)=>{
      this.agents = data;
      console.log(this.agents);
    });
  }

}
