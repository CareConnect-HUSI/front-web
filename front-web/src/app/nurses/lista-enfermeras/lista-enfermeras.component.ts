import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-enfermeras',
  templateUrl: './lista-enfermeras.component.html',
  styleUrls: ['./lista-enfermeras.component.css']
})
export class ListaEnfermerasComponent {
  tiposEnfermeras = ["Enfermeras en turno", "Turno mañana", "Turno tarde", "Turno noche"];
  tipoSeleccionado = "Enfermeras en turno";
  mostrarDropdown = false;

  enfermeras = [
    { id: 1, nombre: "Enfermera 1", imagen: "assets/images/enfermera.png" },
    { id: 2, nombre: "Enfermera 2", imagen: "assets/images/enfermera.png" },
    { id: 3, nombre: "Enfermera 3", imagen: "assets/images/enfermera.png" },
    { id: 4, nombre: "Enfermera 4", imagen: "assets/images/enfermera.png" },
    { id: 5, nombre: "Enfermera 5", imagen: "assets/images/enfermera.png" },
    { id: 5, nombre: "Enfermera 6", imagen: "assets/images/enfermera.png" }
  ];

  enfermeraSeleccionada: any = null;

  constructor(private router: Router) {}

  seleccionarEnfermera(enfermera: any) {
    this.enfermeraSeleccionada = enfermera;
    this.router.navigate(['/nurses-assignment', enfermera.id]); // Redirigir a la ruta con ID
  }

  cambiarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.mostrarDropdown = false; // Ocultar el menú después de seleccionar
  }

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }
}
