import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-asignar-pacientes',
  templateUrl: './asignar-pacientes.component.html',
  styleUrls: ['./asignar-pacientes.component.css']
})
export class AsignarPacientesComponent implements OnInit {
  filtroProgramados: string = '';
  filtroDisponibles: string = '';

  todosPacientes: any[] = [];

  todosPacientesProgramados: any[] = [];
  todosPacientesDisponibles: any[] = [];

  pacientesProgramadosNoAsignados: any[] = [];
  pacientesDisponiblesNoAsignados: any[] = [];
  pacientesAsignados: any[] = [];

  mostrarModalConfirmacion: boolean = false;
  pacienteARemover: any = null;
  motivoRemocion: string = '';

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private pacienteService: PatientService
  ) {}

  ngOnInit(): void {
    this.pacienteService.findAll(0, 50).subscribe({
      next: (response) => {
        this.isLoading = true;
        this.todosPacientes = response.content;
        this.clasificarPacientes();
      },
      error: (err) => {
        console.error('Error al obtener pacientes:', err);
      }
    });
  }

  clasificarPacientes(): void {
    const ahora = new Date();

    this.todosPacientesProgramados = this.todosPacientes.filter(p => {
      return p.actividades?.some((a: { fechaFin: string | number | Date; frecuencia: number; }) => {
        const fechaFin = new Date(a.fechaFin);
        return fechaFin > ahora && a.frecuencia < 24;
      });
    });

    this.todosPacientesDisponibles = this.todosPacientes.filter(p => {
      return !this.todosPacientesProgramados.includes(p);
    });

    this.actualizarListas();
  }

  actualizarListas(): void {
    this.pacientesProgramadosNoAsignados = this.todosPacientesProgramados.filter(
      p => !this.pacientesAsignados.some(a => a.id === p.id)
    );

    this.pacientesDisponiblesNoAsignados = this.todosPacientesDisponibles.filter(
      p => !this.pacientesAsignados.some(a => a.id === p.id)
    );

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
        p.numeroIdentificacion?.toString().includes(busqueda)
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
        p.numeroIdentificacion?.toString().includes(busqueda)
      );
  }

  seleccionarTodosProgramados(): void {
    const nuevos = this.pacientesProgramadosNoAsignados.filter(
      p => !this.pacientesAsignados.some(a => a.id === p.id)
    );
    this.pacientesAsignados = [...this.pacientesAsignados, ...nuevos];
    this.actualizarListas();
  }

  seleccionarTodosDisponibles(): void {
    const nuevos = this.pacientesDisponiblesNoAsignados.filter(
      p => !this.pacientesAsignados.some(a => a.id === p.id)
    );
    this.pacientesAsignados = [...this.pacientesAsignados, ...nuevos];
    this.actualizarListas();
  }

  asignarPaciente(paciente: any): void {
    if (!this.pacientesAsignados.some(p => p.id === paciente.id)) {
      this.pacientesAsignados.push({ ...paciente });
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
