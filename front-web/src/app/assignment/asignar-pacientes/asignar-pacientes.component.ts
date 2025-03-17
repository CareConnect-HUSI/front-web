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
  jornadaSeleccionada: string = 'Mañana';
  mensajeJornada: string = '';
  mostrarRegistro: boolean = false; // Controla la visibilidad del formulario de registro

  constructor() {
    this.actualizarMensaje();
  }

  actualizarMensaje() {
    const fechaActual = new Date().toLocaleDateString();
    this.mensajeJornada = `Seleccione los pacientes para visita domiciliaria del turno de ${this.jornadaSeleccionada} del día ${fechaActual}`;
  }

  filtrarPacientes() {
    const filtroLower = this.filtro.toLowerCase();
    this.pacientesDisponibles = this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(filtroLower) || p.documento.includes(this.filtro)
    );
  }

  moverPaciente(paciente: any) {
    if (!this.pacientesSeleccionados.some(p => p.documento === paciente.documento)) {
      this.pacientesDisponibles = this.pacientesDisponibles.filter(p => p.documento !== paciente.documento);
      this.pacientesSeleccionados.push(paciente);
    }
  }

  removerPaciente(paciente: any) {
    this.pacientesSeleccionados = this.pacientesSeleccionados.filter(p => p.documento !== paciente.documento);
    this.pacientesDisponibles.push(paciente);
  }

  mostrarFormularioRegistro() {
    this.mostrarRegistro = true; // Muestra el formulario de registro
  }

  agregarPaciente(nuevoPaciente: any) {
    // Agrega el nuevo paciente a la lista de pacientes disponibles
    this.pacientes.push(nuevoPaciente);
    this.pacientesDisponibles.push(nuevoPaciente);
    this.mostrarRegistro = false; // Oculta el formulario de registro
  }
}