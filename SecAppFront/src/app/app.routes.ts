import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateAGentComponent } from './agents/create-gent/create-agent.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'createagent', component: CreateAGentComponent}
];
