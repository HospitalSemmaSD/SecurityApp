import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateAGentComponent } from './agents/create-gent/create-agent.component';
import { AgentsListComponent } from './agents/agents-list/agents-list.component';
import { EditAgentComponent } from './agents/edit-agent/edit-agent.component';
import { RangesListComponent } from './ranges/ranges-list/ranges-list.component';
import { CreateRangeComponent } from './ranges/create-range/create-range.component';
import { EditRangeComponent } from './ranges/edit-range/edit-range.component';
import { InstitutionsListComponent } from './institutions/institutions-list/institutions-list.component';
import { CreateInstitutionComponent } from './institutions/create-institution/create-institution.component';
import { EditInstitutionComponent } from './institutions/edit-institution/edit-institution.component';
import { LoginComponent } from './security/login/login.component';
import { AgentFilterComponent } from './agents/agent-filter/agent-filter.component';
import { AgentDetailComponent } from './agents/agent-detail/agent-detail.component';
import { adminGuard } from './shared/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  { path: 'agents', component: AgentsListComponent, canActivate: [adminGuard] },
  { path: 'agents/create', component: CreateAGentComponent }, // Add your guard here if needed
  { path: 'agents/edit/:id', component: EditAgentComponent },
  { path: 'agents/filter', component: AgentFilterComponent },
  {path: 'agents/:id', component: AgentDetailComponent}, // Route to view agent details by ID

  { path: 'ranges', component: RangesListComponent },
  { path: 'ranges/create', component: CreateRangeComponent },
  { path: 'ranges/edit/:id', component: EditRangeComponent },

  { path: 'institutions', component: InstitutionsListComponent },
  { path: 'institutions/create', component: CreateInstitutionComponent },
  { path: 'institutions/edit/:id', component: EditInstitutionComponent },

  { path: '**', redirectTo: '' }, // Redirect to home for any unknown routes,
];
