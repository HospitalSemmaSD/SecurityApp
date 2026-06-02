import { Injectable, inject, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

export interface UrgentNotice {
    title: string;
    content: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection?: signalR.HubConnection;
  private zone = inject(NgZone);
  
  private urgentNoticeSubject = new Subject<UrgentNotice>();
  public urgentNotice$ = this.urgentNoticeSubject.asObservable();

  public startConnection(): void {
    let hubUrl = '';
    if (environment.apiUrl.startsWith('/')) {
        hubUrl = '/notificationHub';
    } else {
        hubUrl = environment.apiUrl.split('/api')[0] + '/notificationHub';
    }
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(() => {
          setTimeout(() => this.startConnection(), 5000);
      });

    this.registerOnEvents();
  }

  private registerOnEvents(): void {
    this.hubConnection?.on('ReceiveNotice', (notice: any) => {
      this.zone.run(() => {
        const isUrgent = notice.isUrgent || notice.IsUrgent;
        if (isUrgent) {
          const urgentData: UrgentNotice = {
              title: notice.title || notice.Title,
              content: notice.content || notice.Content
          };
          this.urgentNoticeSubject.next(urgentData);
        }
      });
    });
  }
}
