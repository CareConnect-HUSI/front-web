import { Component } from '@angular/core';

@Component({
  selector: 'app-asignar-enfermeras',
  templateUrl: './asignar-enfermeras.component.html',
  styleUrls: ['./asignar-enfermeras.component.css']
})
export class AsignarEnfermerasComponent {
  enfermeras = [
    { id: 1, nombre: 'Enfermera 1' },
    { id: 2, nombre: 'Enfermera 2' },
    { id: 3, nombre: 'Enfermera 3' },
    { id: 4, nombre: 'Enfermera 4' },
    { id: 5, nombre: 'Enfermera 5' },
    { id: 6, nombre: 'Enfermera 6' },
    { id: 7, nombre: 'Enfermera 7' },
    { id: 8, nombre: 'Enfermera 8' }
  ];

  enfermerasDisponibles = [...this.enfermeras];
  enfermerasSeleccionadas: any[] = [];
  filtro: string = '';

  filtrarEnfermeras() {
    const filtroLower = this.filtro.toLowerCase();
    this.enfermerasDisponibles = this.enfermeras.filter(e =>
      e.nombre.toLowerCase().includes(filtroLower)
    );
  }

  moverEnfermera(enfermera: any) {
    this.enfermerasDisponibles = this.enfermerasDisponibles.filter(e => e.id !== enfermera.id);
    this.enfermerasSeleccionadas.push(enfermera);
  }

  removerEnfermera(enfermera: any) {
    this.enfermerasSeleccionadas = this.enfermerasSeleccionadas.filter(e => e.id !== enfermera.id);
    this.enfermerasDisponibles.push(enfermera);
  }
}
