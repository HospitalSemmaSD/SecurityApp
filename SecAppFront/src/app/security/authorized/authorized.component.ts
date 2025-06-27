import { Component, inject, Input } from '@angular/core';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-authorized',
  imports: [],
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css'
})
export class AuthorizedComponent {
securityService = inject(SecurityService);

@Input()
rol?: string ;
isLoged(): boolean {
  if (this.rol) {
    return this.securityService.getRol()===this.rol;
  }else {
    return this.securityService.isLoged();
  }
}

}
