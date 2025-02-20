import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = true; // Simula si el usuario está autenticado
  logout() {
    console.log('Cerrando sesión...');
    this.isLoggedIn = false;
  }

}
