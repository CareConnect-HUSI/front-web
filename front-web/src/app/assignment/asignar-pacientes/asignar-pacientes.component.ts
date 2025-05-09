import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OptimizationDataService } from 'src/app/service/optimization-data.service';
import { PatientService } from 'src/app/service/patient.service';


@Component({
  selector: 'app-asignar-pacientes',
  templateUrl: './asignar-pacientes.component.html',
  styleUrls: ['./asignar-pacientes.component.css'],
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
    private pacienteService: PatientService,
    private optimizationDataService: OptimizationDataService
  ) {}

  ngOnInit(): void {
    console.log("Datos:", this.optimizationDataService.getAllData())
    this.isLoading = true;

    this.pacienteService.findAll(0, 50).subscribe({
      next: (response) => {
        this.todosPacientes = response.content;
        this.clasificarPacientes();
        this.isLoading = false;
        console.log('Pacientes obtenidos:', this.todosPacientes);
      },
      error: (err) => {
        this.isLoading = false;
        this.todosPacientes = [];
        console.error('Error al obtener pacientes:', err);
      },
    });
  }

  clasificarPacientes(): void {
    const ahora = new Date();

    this.todosPacientesProgramados = this.todosPacientes.filter((p) => {
      return p.actividades?.some(
        (a: { fechaFin: string | number | Date; frecuencia: number }) => {
          const fechaFin = new Date(a.fechaFin);
          return fechaFin > ahora && a.frecuencia < 24;
        }
      );
    });

    this.todosPacientesDisponibles = this.todosPacientes.filter((p) => {
      return !this.todosPacientesProgramados.includes(p);
    });

    this.actualizarListas();
  }

  actualizarListas(): void {
    this.pacientesProgramadosNoAsignados =
      this.todosPacientesProgramados.filter(
        (p) => !this.pacientesAsignados.some((a) => a.id === p.id)
      );

    this.pacientesDisponiblesNoAsignados =
      this.todosPacientesDisponibles.filter(
        (p) => !this.pacientesAsignados.some((a) => a.id === p.id)
      );

    this.filtrarPacientesProgramados();
    this.filtrarPacientesDisponibles();
  }

  filtrarPacientesProgramados(): void {
    if (!this.filtroProgramados) {
      this.pacientesProgramadosNoAsignados =
        this.todosPacientesProgramados.filter(
          (p) => !this.pacientesAsignados.some((a) => a.id === p.id)
        );
      return;
    }

    const busqueda = this.filtroProgramados.toLowerCase();
    this.pacientesProgramadosNoAsignados = this.todosPacientesProgramados
      .filter((p) => !this.pacientesAsignados.some((a) => a.id === p.id))
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda) ||
          p.numeroIdentificacion?.toString().includes(busqueda)
      );
  }

  filtrarPacientesDisponibles(): void {
    if (!this.filtroDisponibles) {
      this.pacientesDisponiblesNoAsignados =
        this.todosPacientesDisponibles.filter(
          (p) => !this.pacientesAsignados.some((a) => a.id === p.id)
        );
      return;
    }

    const busqueda = this.filtroDisponibles.toLowerCase();
    this.pacientesDisponiblesNoAsignados = this.todosPacientesDisponibles
      .filter((p) => !this.pacientesAsignados.some((a) => a.id === p.id))
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda) ||
          p.numeroIdentificacion?.toString().includes(busqueda)
      );
  }

  seleccionarTodosProgramados(): void {
    const nuevos = this.pacientesProgramadosNoAsignados.filter(
      (p) => !this.pacientesAsignados.some((a) => a.id === p.id)
    );
    this.pacientesAsignados = [...this.pacientesAsignados, ...nuevos];
    this.actualizarListas();
  }

  seleccionarTodosDisponibles(): void {
    const nuevos = this.pacientesDisponiblesNoAsignados.filter(
      (p) => !this.pacientesAsignados.some((a) => a.id === p.id)
    );
    this.pacientesAsignados = [...this.pacientesAsignados, ...nuevos];
    this.actualizarListas();
  }

  asignarPaciente(paciente: any): void {
    if (!this.pacientesAsignados.some((p) => p.id === paciente.id)) {
      this.pacientesAsignados.push({ ...paciente });
      this.actualizarListas();
    }
    console.log('Pacientes asignados:', this.pacientesAsignados);
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
      const index = this.pacientesAsignados.findIndex(
        (p) => p.id === this.pacienteARemover.id
      );
      if (index !== -1) {
        console.log(
          `Paciente removido: ${this.pacienteARemover.nombre}. Motivo: ${this.motivoRemocion}`
        );
        this.pacientesAsignados.splice(index, 1);
        this.cerrarModalConfirmacion();
        this.actualizarListas();
      }
    }
    console.log('Pacientes asignados:', this.pacientesAsignados);
  }

  navegarARegistroPaciente(): void {
    const pacientesManana: any[] = [];
    const pacientesTarde: any[] = [];
    const pacientesNoche: any[] = [];

    this.pacientesAsignados.forEach((paciente) => {
      // Buscar la primera hora válida en las actividades
      const hora = this.getPrimeraHoraValida(paciente.actividades);

      if (!hora) {
        console.warn(
          `El paciente ${paciente.nombre} no tiene horario asignado. Asignado a Turno Noche por defecto.`
        );
        pacientesNoche.push(paciente);
        return;
      }

      // Determinar el turno basado en la hora encontrada
      const turno = this.getTurnoByHora(hora);

      if (turno === 'Manana') {
        pacientesManana.push(paciente);
      } else if (turno === 'Tarde') {
        pacientesTarde.push(paciente);
      } else {
        pacientesNoche.push(paciente);
      }
    });

    // Guardar en OptimizationDataService
    this.optimizationDataService.setInfoPacientesManana(pacientesManana);
    this.optimizationDataService.setInfoPacientesTarde(pacientesTarde);
    this.optimizationDataService.setInfoPacientesNoche(pacientesNoche);
    this.router.navigate(['/registro-pacientes']);
  }
  // Función auxiliar para determinar el turno basado en la hora
  private getTurnoByHora(hora: string): string {
    if (!hora) return 'Noche'; // Valor por defecto si no hay hora

    const [hours, minutes] = hora.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    // Turno Mañana: 7:00 AM (420 min) - 1:00 PM (780 min)
    if (totalMinutes >= 420 && totalMinutes < 780) {
      return 'Manana';
    }
    // Turno Tarde: 1:00 PM (780 min) - 7:00 PM (1140 min)
    else if (totalMinutes >= 780 && totalMinutes < 1140) {
      return 'Tarde';
    }
    // Turno Noche: 7:00 PM (1140 min) - 7:00 AM (420 min del día siguiente)
    else {
      return 'Noche';
    }
  }

  private getPrimeraHoraValida(actividades: any[]): string | null {
    if (!actividades || !Array.isArray(actividades)) {
      return null;
    }

    for (const actividad of actividades) {
      if (
        actividad?.hora &&
        typeof actividad.hora === 'string' &&
        actividad.hora.match(/^\d{2}:\d{2}$/)
      ) {
        return actividad.hora;
      }
    }

    return null;
  }

  navegarSiguiente(): void {
    // Clasificar pacientes por turno según la hora de sus actividades
    const pacientesManana: any[] = [];
    const pacientesTarde: any[] = [];
    const pacientesNoche: any[] = [];

    this.pacientesAsignados.forEach((paciente) => {
      // Buscar la primera hora válida en las actividades
      const hora = this.getPrimeraHoraValida(paciente.actividades);

      if (!hora) {
        console.warn(
          `El paciente ${paciente.nombre} no tiene horario asignado. Asignado a Turno Noche por defecto.`
        );
        pacientesNoche.push(paciente);
        return;
      }

      // Determinar el turno basado en la hora encontrada
      const turno = this.getTurnoByHora(hora);

      if (turno === 'Manana') {
        pacientesManana.push(paciente);
      } else if (turno === 'Tarde') {
        pacientesTarde.push(paciente);
      } else {
        pacientesNoche.push(paciente);
      }
    });

    // Guardar en OptimizationDataService
    this.optimizationDataService.setInfoPacientesManana(pacientesManana);
    this.optimizationDataService.setInfoPacientesTarde(pacientesTarde);
    this.optimizationDataService.setInfoPacientesNoche(pacientesNoche);

    console.log('Pacientes asignados por turno:', {
      Manana: pacientesManana,
      Tarde: pacientesTarde,
      Noche: pacientesNoche,
    });
    console.log(
      'Datos en OptimizationDataService:',
      this.optimizationDataService.getAllData()
    );

    // Navegar a la siguiente pantalla
    this.router.navigate(['/asignar-enfermeras']);
  }
}
