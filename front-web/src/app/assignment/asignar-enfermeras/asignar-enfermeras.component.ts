import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  generarCronograma(): void {
    this.isLoading = true;
    alert('El cronograma se generará con los pacientes asignados y en los turnos asignados a las enfermeras');

    this.optimizationDataService.setInfoEnfermerasManana(this.enfermerasManana);
    this.optimizationDataService.setInfoEnfermerasTarde(this.enfermerasTarde);
    this.optimizationDataService.setInfoEnfermerasNoche(this.enfermerasNoche);


    console.log("Todos a cronograma:", this.optimizationDataService.getAllData());

    this.optimizationDataService.generarCronogramaManana()
    .subscribe({
      next: (response) => {
        this.optimizationDataService.setBorrador(true);
        
        // Navigate to cronograma after successful response
        this.router.navigate(['/cronograma'], {
          state: { enfermeras: this.enfermeras }
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Error en optimización:", error);
        // Show error message to user (using your preferred notification system)
        alert('Error al generar el cronograma. Por favor, inténtelo de nuevo.');
      }
    });
    this.optimizationDataService.setBorrador(true);
    
    setTimeout(() => {
      this.router.navigate(['/cronograma'], {
        state: { enfermeras: this.enfermeras }
      });
    }, 2000);
  }

  volverAPacientes():void{
    this.optimizationDataService.setInfoEnfermerasManana(this.enfermerasManana);
    this.router.navigate(['/asignar-pacientes']);
  }
}
