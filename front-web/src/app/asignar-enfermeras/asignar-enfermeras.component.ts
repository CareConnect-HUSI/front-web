import { Component } from '@angular/core';

@Component({
  selector: 'app-asignar-enfermeras',
  templateUrl: './asignar-enfermeras.component.html',
  styleUrls: ['./asignar-enfermeras.component.css']
})
export class AsignarEnfermerasComponent {
  searchQuery: string = '';

  pacientes = [
    { nombre: 'Juan Pablo Rodríguez', ubicacion: 'Suba', hora: '7:00', seleccionado: false },
    { nombre: 'María Fernanda López', ubicacion: 'Chapinero', hora: '8:00', seleccionado: false },
    { nombre: 'Carlos Ramírez', ubicacion: 'Usaquén', hora: '9:00', seleccionado: false },
    { nombre: 'Ana Sofía Méndez', ubicacion: 'Teusaquillo', hora: '10:00', seleccionado: false }
  ];

  // Filtrar pacientes según búsqueda
  pacientesFiltrados() {
    return this.pacientes.filter(p => 
      p.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Acción de asignar enfermeras
  asignarEnfermeras() {
    const seleccionados = this.pacientes.filter(p => p.seleccionado);
    if (seleccionados.length === 0) {
      alert('Por favor, selecciona al menos un paciente.');
    } else {
      alert(`Se asignaron enfermeras a ${seleccionados.length} pacientes.`);
    }
  }
}
