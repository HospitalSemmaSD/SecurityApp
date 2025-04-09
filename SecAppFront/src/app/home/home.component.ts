import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { AgentsListComponent } from "../agents/agents-list/agents-list.component";


@Component({
  selector: 'app-home',
  imports: [MatButtonModule, AgentsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  //morties: any[]=[];
  
  constructor() { }
   
  // llenarData(){ 
  //   this.apiService.getMorty().subscribe((data: any) => {
  //     this.morties = data.results;
  //     console.log(this.morties);
  //   });
  // }
}
