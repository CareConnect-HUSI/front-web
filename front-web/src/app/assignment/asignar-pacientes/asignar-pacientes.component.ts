import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignar-pacientes',
  templateUrl: './asignar-pacientes.component.html',
  styleUrls: ['./asignar-pacientes.component.css']
})
export class AsignarPacientesComponent implements OnInit {
  filtroProgramados: string = '';
  filtroDisponibles: string = '';
  
  // Datos quemados para prueba (7am hoy a 7am mañana)
  todosPacientesProgramados: any[] = [
    { id: 1, nombre: 'Juan Pérez', documento: '12345678', horario: '8:00 AM', esProgramado: true },
    { id: 2, nombre: 'María Gómez', documento: '87654321', horario: '10:00 AM', esProgramado: true },
    { id: 3, nombre: 'Carlos López', documento: '56781234', horario: '2:00 PM', esProgramado: true },
    { id: 4, nombre: 'Ana Torres', documento: '43218765', horario: '4:00 PM', esProgramado: true },
    { id: 5, nombre: 'Luisa Fernández', documento: '98765432', horario: '8:00 PM', esProgramado: true },
    { id: 6, nombre: 'Pedro Rojas', documento: '13579246', horario: '11:00 PM', esProgramado: true },
    { id: 7, nombre: 'Sofía Mendoza', documento: '24681357', horario: '1:00 AM', esProgramado: true },
    { id: 8, nombre: 'Ricardo Castro', documento: '36925814', horario: '5:00 AM', esProgramado: true }
  ];
  
  todosPacientesDisponibles: any[] = [
    { id: 9, nombre: 'Laura Jiménez', documento: '48263917', esProgramado: false },
    { id: 10, nombre: 'Miguel Ángel', documento: '15926348', esProgramado: false },
    { id: 11, nombre: 'Diana García', documento: '75315984', esProgramado: false }
  ];
  
  pacientesAsignados: any[] = [];
  pacientesProgramadosNoAsignados: any[] = [];
  pacientesDisponiblesNoAsignados: any[] = [];

  // Variables para el modal de confirmación
  mostrarModalConfirmacion: boolean = false;
  pacienteARemover: any = null;
  motivoRemocion: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.actualizarListas();
  }

  actualizarListas(): void {
    // Pacientes programados que no están asignados
    this.pacientesProgramadosNoAsignados = this.todosPacientesProgramados.filter(
      p => !this.pacientesAsignados.some(a => a.id === p.id)
    );
    
    // Pacientes disponibles que no están asignados
    this.pacientesDisponiblesNoAsignados = this.todosPacientesDisponibles.filter(
      p => !this.pacientesAsignados.some(a => a.id === p.id)
    );
    
    // Filtrar según búsquedas
    this.filtrarPacientesProgramados();
    this.filtrarPacientesDisponibles();
  }

  filtrarPacientesProgramados(): void {
    if (!this.filtroProgramados) {
      this.pacientesProgramadosNoAsignados = this.todosPacientesProgramados.filter(
        p => !this.pacientesAsignados.some(a => a.id === p.id)
      );
      return;
    }
    
    const busqueda = this.filtroProgramados.toLowerCase();
    this.pacientesProgramadosNoAsignados = this.todosPacientesProgramados
      .filter(p => !this.pacientesAsignados.some(a => a.id === p.id))
      .filter(p => 
        p.nombre.toLowerCase().includes(busqueda) || 
        p.documento.toString().includes(busqueda)
      );
  }

  filtrarPacientesDisponibles(): void {
    if (!this.filtroDisponibles) {
      this.pacientesDisponiblesNoAsignados = this.todosPacientesDisponibles.filter(
        p => !this.pacientesAsignados.some(a => a.id === p.id)
      );
      return;
    }
    
    const busqueda = this.filtroDisponibles.toLowerCase();
    this.pacientesDisponiblesNoAsignados = this.todosPacientesDisponibles
      .filter(p => !this.pacientesAsignados.some(a => a.id === p.id))
      .filter(p => 
        p.nombre.toLowerCase().includes(busqueda) || 
        p.documento.toString().includes(busqueda)
      );
  }

  seleccionarTodosProgramados(): void {
    const nuevosPacientes = this.pacientesProgramadosNoAsignados.filter(
      p => !this.pacientesAsignados.some(a => a.id === p.id)
    );
    
    this.pacientesAsignados = [...this.pacientesAsignados, ...nuevosPacientes];
    this.actualizarListas();
  }

  seleccionarTodosDisponibles(): void {
    const nuevosPacientes = this.pacientesDisponiblesNoAsignados.filter(
      p => !this.pacientesAsignados.some(a => a.id === p.id)
    );
    
    this.pacientesAsignados = [...this.pacientesAsignados, ...nuevosPacientes];
    this.actualizarListas();
  }

  asignarPaciente(paciente: any): void {
    if (!this.pacientesAsignados.some(p => p.id === paciente.id)) {
      this.pacientesAsignados.push({...paciente});
      this.actualizarListas();
    }
  }

  abrirModalConfirmacion(paciente: any): void {
    this.pacienteARemover = paciente;
    this.motivoRemocion = '';
    this.mostrarModalConfirmacion = true;
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;
    this.pacienteARemover = null;
    this.motivoRemocion = '';
  }

  confirmarRemocion(): void {
    if (this.pacienteARemover && this.motivoRemocion) {
      const index = this.pacientesAsignados.findIndex(p => p.id === this.pacienteARemover.id);
      if (index !== -1) {
        // Registrar motivo de remoción
        console.log(`Paciente removido: ${this.pacienteARemover.nombre}. Motivo: ${this.motivoRemocion}`);
        
        this.pacientesAsignados.splice(index, 1);
        this.cerrarModalConfirmacion();
        this.actualizarListas();
      }
    }
  }

  navegarARegistroPaciente(): void {
    this.router.navigate(['/registro-paciente']);
  }
}