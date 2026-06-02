import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Agent } from '../../models/agent.model';
import { AgentService } from '../../services/agent.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  authService = inject(AuthService);
  agentService = inject(AgentService);

  agentProfile = signal<Agent | null>(null);

  usuarioConectado = computed(() => {
    const profile = this.agentProfile();
    if (profile) return profile.fullName;

    const user = this.authService.currentUser();
    return user?.fullName || user?.username || 'Oficial del Día';
  });

  fotoPerfil = computed(() => {
    const profile = this.agentProfile();

    let serverUrl = environment.apiUrl;
    if (serverUrl.endsWith('/api')) {
      serverUrl = serverUrl.replace('/api', '');
    } else if (serverUrl === '/api') {
      serverUrl = '';
    }

    if (profile?.photo) {
      const photoPath = profile.photo.startsWith('http')
        ? profile.photo
        : (profile.photo.startsWith('/') ? profile.photo : `/${profile.photo}`);

      return `${serverUrl}${photoPath}`;
    }

    const defaultImg = profile?.gender === 'F' ? 'default-female.jpg' : 'default-male.jpg';
    return `${serverUrl}/img/agents/${defaultImg}`;
  });

  canViewRanksAndInstitutions = computed(() => this.authService.hasRole(['Admin', 'Operator']));
  canViewUsers = computed(() => this.authService.hasRole(['Admin']));
  canViewNotices = computed(() => this.authService.hasRole(['Admin', 'Operator']));

  ngOnInit() {
    const currentUser = this.authService.currentUser();
    const ident = currentUser?.identification;
    const fullName = currentUser?.fullName;

    if (ident && ident.trim() !== '') {
      this.agentService.getAgentByIdentification(ident).subscribe({
        next: (agent) => this.processAgentProfile(agent, 'Cédula'),
        error: () => this.fallbackToName(fullName)
      });
    } else {
      this.fallbackToName(fullName);
    }
  }

  private fallbackToName(fullName: string | undefined) {
    if (fullName && fullName.trim() !== '') {
      this.agentService.searchAgents(fullName).subscribe({
        next: (results) => {
          if (results.length > 0) {
            const agent = results.find(a => a.fullName.toLowerCase().includes(fullName.toLowerCase())) || results[0];
            this.processAgentProfile(agent, 'Nombre');
          }
        }
      });
    }
  }

  private processAgentProfile(agent: Agent | null | undefined, metodo: string) {
    if (agent) {
      this.agentProfile.set(agent);
    }
  }

  onLogout() {
    this.authService.logout();
  }
}