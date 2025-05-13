import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { NurseService } from 'src/app/service/nurse.service';
import { OptimizationDataService } from 'src/app/service/optimization-data.service';


interface Turno {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-asignar-enfermeras',
  templateUrl: './asignar-enfermeras.component.html',
  styleUrls: ['./asignar-enfermeras.component.css']
})
export class AsignarEnfermerasComponent implements OnInit {
  turnos: Turno[] = [
    { id: 1, nombre: 'Mañana' },
    { id: 2, nombre: 'Tarde' },
    { id: 3, nombre: 'Noche' }
  ];

  enfermeras: any[] = [];
  enfermerasManana: any[] = [];
  enfermerasTarde: any[] = [];
  enfermerasNoche: any[] = [];
  enfermerasSinTurno: any[] = []; // Nueva lista para enfermeras sin turno


  filtroNombre: string = '';
  filtroNoSeleccionadas: string = ''; // Nuevo filtro para búsqueda de no seleccionadas
  filtroTurnoId: number | null = null;

  mostrarModalRemover: boolean = false;
  enfermeraARemover: any | null = null;
  motivoRemocion: string = '';

  isLoading: boolean = false;

  constructor(private router: Router, private nurseService: NurseService, private optimizationDataService: OptimizationDataService,
  ) {}

  ngOnInit(): void {
    this.cargarEnfermeras();
    console.log('Datos de optimización:', this.optimizationDataService.getAllData());
  }

  cargarEnfermeras(): void {
    this.isLoading = true;
    this.nurseService.findAll(0, 100).subscribe({
      next: (response) => {
        this.enfermeras = (response.content || response).map((e: any) => ({
          id: e.id,
          nombre: e.nombre,
          apellido: e.apellido || '',
          numeroIdentificacion: e.numeroIdentificacion,
          telefono: e.telefono || '',
          turnoId: e.turnoEntity?.id ?? null,
          latitud: e.latitud,
          longitud: e.longitud
        }));
        this.actualizarListasPorTurno();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar enfermeras', error);
      }
    });
  }
  

  actualizarListasPorTurno(): void {
    let baseList = this.enfermeras;
    if (this.filtroNombre) {
      const filtro = this.filtroNombre.toLowerCase();
      baseList = baseList.filter(e =>
        e.nombre.toLowerCase().includes(filtro) ||
        e.numeroIdentificacion.includes(this.filtroNombre)
      );
    }
    this.enfermerasManana = baseList.filter(e => e.turnoId === 1);
    this.enfermerasTarde = baseList.filter(e => e.turnoId === 2);
    this.enfermerasNoche = baseList.filter(e => e.turnoId === 3);
    this.enfermerasSinTurno = baseList.filter((e) => !e.turnoId); 

  }

  filtrarEnfermeras(): void {
    this.actualizarListasPorTurno();
  }

  filtrarEnfermerasNoSeleccionadas(): void {
    const filtro = this.filtroNoSeleccionadas.toLowerCase();
    this.enfermerasSinTurno = this.enfermeras.filter(
      (e) =>
        !e.turnoId &&
        (e.nombre.toLowerCase().includes(filtro) ||
          e.numeroIdentificacion.includes(filtro))
    );
  }

  filtrarPorTurno(turnoId: number | null): void {
    this.filtroTurnoId = turnoId;
    this.actualizarListasPorTurno();
  }

  cambiarTurno(enfermera: any): void {
    const index = this.enfermeras.findIndex(e => e.id === enfermera.id);
    if (index !== -1) {
      this.enfermeras[index] = { ...enfermera };
      this.enfermeras = [...this.enfermeras];
      this.actualizarListasPorTurno();
    }
  }

  asignarTurno(enfermera: any): void {
    if (enfermera.turnoId) {
      this.cambiarTurno(enfermera); // Reutiliza la lógica de cambiarTurno
    }
  }

  seleccionarTodasNoSeleccionadas(): void {
    this.enfermerasSinTurno.forEach((enfermera) => {
      enfermera.turnoId = 1; // Asigna Turno Mañana por defecto (puedes cambiarlo)
      this.cambiarTurno(enfermera); // Actualiza cada enfermera
    });
  }

  abrirModalRemover(enfermera: any): void {
    this.enfermeraARemover = enfermera;
    this.motivoRemocion = '';
    this.mostrarModalRemover = true;
  }

  cerrarModalRemover(): void {
    this.mostrarModalRemover = false;
    this.enfermeraARemover = null;
    this.motivoRemocion = '';
  }

  confirmarRemocion(): void {
    if (!this.enfermeraARemover || !this.motivoRemocion) return;

    const enfermera = this.enfermeras.find((e) => e.id === this.enfermeraARemover?.id);
    if (enfermera) {
      enfermera.turnoId = null; // Quita el turno en lugar de eliminar la enfermera
      this.cambiarTurno(enfermera); // Actualiza en frontend y backend
    }
    this.cerrarModalRemover();
  }

  trackByEnfermeraId(index: number, enfermera: any): number {
    return enfermera.id;
  }

  async generarCronograma(): Promise<void> {
    this.isLoading = true;
    alert('Los cronogramas se generarán con los pacientes asignados y en los turnos asignados a las enfermeras');
  
    // Asignar enfermeras a los turnos en el servicio
    this.optimizationDataService.setInfoEnfermerasManana(this.enfermerasManana);
    this.optimizationDataService.setInfoEnfermerasTarde(this.enfermerasTarde);
    this.optimizationDataService.setInfoEnfermerasNoche(this.enfermerasNoche);
  
    console.log("Todos a cronograma:", this.optimizationDataService.getAllData());
  
    // Preparar las solicitudes válidas
    const solicitudes = [];
    const mensajes: string[] = [];
  
    // Validar turno Mañana
    const pacientesManana = this.optimizationDataService.getInfoPacientesManana() || [];
    if (this.enfermerasManana.length === 0 || pacientesManana.length === 0) {
      mensajes.push('No hay enfermeras o pacientes asignados para el turno Mañana.');
    } else {
      solicitudes.push({ shift: 'manana', request: this.optimizationDataService.generarCronogramaManana() });
    }
  
    // Validar turno Tarde
    const pacientesTarde = this.optimizationDataService.getInfoPacientesTarde() || [];
    if (this.enfermerasTarde.length === 0 || pacientesTarde.length === 0) {
      mensajes.push('No hay enfermeras o pacientes asignados para el turno Tarde.');
    } else {
      solicitudes.push({ shift: 'tarde', request: this.optimizationDataService.generarCronogramaTarde() });
    }
  
    // Validar turno Noche
    const pacientesNoche = this.optimizationDataService.getInfoPacientesNoche() || [];
    if (this.enfermerasNoche.length === 0 || pacientesNoche.length === 0) {
      mensajes.push('No hay enfermeras o pacientes asignados para el turno Noche.');
    } else {
      solicitudes.push({ shift: 'noche', request: this.optimizationDataService.generarCronogramaNoche() });
    }
  
    // Si no hay solicitudes válidas, mostrar mensajes y detener el proceso
    if (solicitudes.length === 0) {
      this.isLoading = false;
      alert('No se pueden generar cronogramas:\n' + mensajes.join('\n'));
      return;
    }
  
    try {
      // Procesar solicitudes secuencialmente
      for (const solicitud of solicitudes) {
        const respuesta = await firstValueFrom(solicitud.request); // Convert Observable to Promise and wait
        // Asignar respuesta según el turno
        if (solicitud.shift === 'manana') {
          this.optimizationDataService.setRespuestaManana(respuesta);
        } else if (solicitud.shift === 'tarde') {
          this.optimizationDataService.setRespuestaTarde(respuesta);
        } else if (solicitud.shift === 'noche') {
          this.optimizationDataService.setRespuestaNoche(respuesta);
        }
      }
  
      // Marcar como borrador
      this.optimizationDataService.setBorrador(true);
  
      // Mostrar advertencias si algunos turnos no se procesaron
      if (mensajes.length > 0) {
        alert('Advertencia:\n' + mensajes.join('\n'));
      }
  
      // Navegar a la página de cronograma
      this.isLoading = false;
      this.router.navigate(['/cronograma'], {
        state: { enfermeras: this.enfermeras }
      });
    } catch (error) {
      this.isLoading = false;
      console.error("Error en optimización:", error);
      alert('Error al generar los cronogramas. Por favor, inténtelo de nuevo.');
    }
  }

  volverAPacientes():void{
    this.optimizationDataService.setInfoEnfermerasManana(this.enfermerasManana);
    this.optimizationDataService.setInfoEnfermerasTarde(this.enfermerasTarde);
    this.optimizationDataService.setInfoEnfermerasNoche(this.enfermerasNoche);

    this.router.navigate(['/asignar-pacientes']);
  }
}
