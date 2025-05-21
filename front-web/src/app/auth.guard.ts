import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Verificar si el token está presente
    if (token) {
      return true; // El usuario está autenticado
    } else {
      // Si no está autenticado, redirigir a la página de login
      this.router.navigate(['/login']);
      return false; // Bloquear el acceso a la ruta protegida
    }
  }
}
