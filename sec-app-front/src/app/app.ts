import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalRService } from './core/services/signalr.service';
import { LiveAlertComponent } from './shared/components/live-alert/live-alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LiveAlertComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private signalR = inject(SignalRService);
  protected readonly title = signal('sec-app-front');

  ngOnInit(): void {
    this.signalR.startConnection();
  }
}
