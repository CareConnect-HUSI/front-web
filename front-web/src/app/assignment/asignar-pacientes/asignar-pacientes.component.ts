import { Component } from '@angular/core';

// Definir la interfaz
interface Paciente {
  documento: string;
  nombre: string;
  recienAgregado?: boolean; // La propiedad es opcional
}

@Component({
  selector: 'app-asignar-pacientes',
  templateUrl: './asignar-pacientes.component.html',
  styleUrls: ['./asignar-pacientes.component.css']
})
export class AsignarPacientesComponent {
  pacientes: Paciente[] = [
    { documento: '123456789', nombre: 'Juan Pablo Rodríguez' },
    { documento: '987654321', nombre: 'Ana González' },
    { documento: '456789123', nombre: 'Andrés Quintero' },
    { documento: '321654987', nombre: 'Laura Mendoza' },
    { documento: '789456123', nombre: 'Carlos Ramírez' }
  ];

  pacientesDisponibles: Paciente[] = [...this.pacientes];
  pacientesSeleccionados: Paciente[] = [];
  filtro: string = '';
  jornadaSeleccionada: string = 'Mañana';
  mensajeJornada: string = '';
  mostrarRegistro: boolean = false;

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

  moverPaciente(paciente: Paciente) {
    if (!this.pacientesSeleccionados.some(p => p.documento === paciente.documento)) {
      this.pacientesDisponibles = this.pacientesDisponibles.filter(p => p.documento !== paciente.documento);
      this.pacientesSeleccionados.push(paciente);
    }
  }

  removerPaciente(paciente: Paciente) {
    this.pacientesSeleccionados = this.pacientesSeleccionados.filter(p => p.documento !== paciente.documento);
    this.pacientesDisponibles.push(paciente);
  }

  mostrarFormularioRegistro() {
    this.mostrarRegistro = true; // Muestra el formulario
  
    // Desplazarse suavemente hasta el formulario
    setTimeout(() => {
      const formulario = document.querySelector('.formulario-registro');
      if (formulario) {
        formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Pequeño retraso para asegurar que el formulario esté visible
  }

  agregarPaciente(nuevoPaciente: Paciente) {
    const pacienteExistente = this.pacientes.find(p => p.documento === nuevoPaciente.documento);
    if (!pacienteExistente) {
      nuevoPaciente.recienAgregado = true; // Marcar como recién agregado
      this.pacientes.unshift(nuevoPaciente); // Agregar al inicio de la lista
      this.pacientesDisponibles.unshift(nuevoPaciente); // Agregar al inicio de la lista disponible
      this.mostrarRegistro = false; // Oculta el formulario
  
      // Eliminar el indicador después de 2 segundos
      setTimeout(() => {
        nuevoPaciente.recienAgregado = false;
      }, 2000);
    } else {
      alert('El paciente ya está registrado.');
    }
  }
}