import { Component } from '@angular/core';

@Component({
  selector: 'app-asignar-pacientes',
  templateUrl: './asignar-pacientes.component.html',
  styleUrls: ['./asignar-pacientes.component.css']
})
export class AsignarPacientesComponent {
  pacientes = [
    { documento: '123456789', nombre: 'Juan Pablo Rodríguez' },
    { documento: '987654321', nombre: 'Ana González' },
    { documento: '456789123', nombre: 'Andrés Quintero' },
    { documento: '321654987', nombre: 'Laura Mendoza' },
    { documento: '789456123', nombre: 'Carlos Ramírez' }
  ];

  pacientesDisponibles = [...this.pacientes];
  pacientesSeleccionados: any[] = [];
  filtro: string = '';

  filtrarPacientes() {
    const filtroLower = this.filtro.toLowerCase();
    this.pacientesDisponibles = this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(filtroLower) || p.documento.includes(this.filtro)
    );
  }

  moverPaciente(paciente: any) {
    this.pacientesDisponibles = this.pacientesDisponibles.filter(p => p.documento !== paciente.documento);
    this.pacientesSeleccionados.push(paciente);
  }

  removerPaciente(paciente: any) {
    this.pacientesSeleccionados = this.pacientesSeleccionados.filter(p => p.documento !== paciente.documento);
    this.pacientesDisponibles.push(paciente);
  }
}
