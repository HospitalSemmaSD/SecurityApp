import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-landing',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
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
