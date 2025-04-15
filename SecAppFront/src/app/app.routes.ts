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
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  { path: 'agents', component: AgentsListComponent },
  { path: 'create-agent', component: CreateAGentComponent },
  { path: 'edit-agent', component: EditAgentComponent },

  { path: 'ranges', component: RangesListComponent },
  { path: 'create-range', component: CreateRangeComponent },
  { path: 'edit-range', component: EditRangeComponent },

  { path: 'institutions', component: InstitutionsListComponent },
  { path: 'create-institution', component: CreateInstitutionComponent },
  { path: 'edit-institution', component: EditInstitutionComponent },
];
