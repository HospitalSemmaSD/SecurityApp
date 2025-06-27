import { Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  

 isLoged(): boolean {return false;};
 

 getRol(): string {
    return 'user'; // This should be replaced with actual logic to get the user's role
 }
}
