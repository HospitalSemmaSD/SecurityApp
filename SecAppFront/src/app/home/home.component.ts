import { Component } from '@angular/core';
import { LandingComponent } from '../landing/landing.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  imports: [LandingComponent, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor() {}
}
