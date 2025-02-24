import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  activeDropdown: string | null = null;

  constructor(private router: Router) {}

  showDropdown(menu: string) {
    this.activeDropdown = menu;
  }

  hideDropdown() {
    this.activeDropdown = null;
  }

  logout() {
    // Aquí iría la lógica para cerrar sesión
    console.log("Cerrar sesión");
    this.router.navigate(['/login']);
  }
}
