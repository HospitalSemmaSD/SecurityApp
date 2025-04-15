import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor() {}
  features = [
    {
      icon: 'security',
      title: 'Gestión de Seguridad',
      description:
        'Control completo sobre los protocolos de seguridad del hospital',
    },
    {
      icon: 'verified_user',
      title: 'Accesos Verificados',
      description: 'Sistema de autenticación para personal autorizado',
    },
    {
      icon: 'report',
      title: 'Reportes en Tiempo Real',
      description: 'Generación de informes de incidentes de seguridad',
    },
  ];
}
