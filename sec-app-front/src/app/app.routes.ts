import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { AgentFormComponent } from './features/agents/agent-form/agent-form.component';
import { AgentsListComponent } from './features/agents/agents-list/agents-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/dashboard/home/home.component';
import { InstitutionListComponent } from './features/institutions/institution-list/institution-list.component';
import { RankListComponent } from './features/ranks/rank-list/rank-list.component';
import { ShiftListComponent } from './features/shifts/shift-list/shift-list.component';
import { DutyPostListComponent } from './features/duty-posts/duty-post-list/duty-post-list.component';
import { RosterViewComponent } from './features/duty-roster/roster-view/roster-view.component';
import { ResponsibleListComponent } from './features/responsibles/responsible-list/responsible-list.component';
import { UserFormComponent } from './features/users/user-form/user-form.component';
import { UsersListComponent } from './features/users/users-list/users-list.component';
import { AuditLogsComponent } from './features/audit-logs/audit-logs.component';
import { IncidentFormComponent } from './features/incidents/incident-form/incident-form.component';
import { IncidentsListComponent } from './features/incidents/incidents-list/incidents-list.component';
import { NoticesListComponent } from './features/notices/notices-list/notices-list.component';
import { NoticeFormComponent } from './features/notices/notice-form/notice-form.component';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'app', 
    component: MainLayoutComponent,
    canActivate: [authGuard], 
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'incidents/new', component: IncidentFormComponent },
      { path: 'incidents', component: IncidentsListComponent },
      { 
        path: 'notices', 
        component: NoticesListComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Operator'] }
      },
      { 
        path: 'notices/new', 
        component: NoticeFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Operator'] }
      },
      { path: 'agents', component: AgentsListComponent }, 
      { path: 'agents/new', component: AgentFormComponent }, 
      { path: 'agents/edit/:id', component: AgentFormComponent },
      { 
        path: 'users', 
        component: UsersListComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
      }, 
      { path: 'users/new', component: UserFormComponent }, 
      { path: 'users/edit/:id', component: UserFormComponent },
      { 
        path: 'audit', 
        component: AuditLogsComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
      },
      { path: 'institutions', component: InstitutionListComponent },
      { path: 'ranks', component: RankListComponent },
      { path: 'shifts', component: ShiftListComponent },
      { path: 'duty-posts', component: DutyPostListComponent },
      { path: 'roster', component: RosterViewComponent },
      { path: 'responsibles', component: ResponsibleListComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];