import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NurseService } from 'src/app/service/nurse.service';

interface Enfermera {
  id: number;
  nombre: string;
  apellido?: string;
  numeroIdentificacion: string;
  telefono: string;
  turnoId: number | null;
}

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

  enfermeras: Enfermera[] = [];
  enfermerasManana: Enfermera[] = [];
  enfermerasTarde: Enfermera[] = [];
  enfermerasNoche: Enfermera[] = [];

  filtroNombre: string = '';
  filtroTurnoId: number | null = null;

  mostrarModalRemover: boolean = false;
  enfermeraARemover: Enfermera | null = null;
  motivoRemocion: string = '';

  isLoading: boolean = false;

  constructor(private router: Router, private nurseService: NurseService) {}

  ngOnInit(): void {
    this.cargarEnfermeras();
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
          turnoId: e.turnoEntity?.id ?? null
        }));
  
        console.log('Enfermeras cargadas:', this.enfermeras);
        this.actualizarListasPorTurno();
        this.isLoading = false;
      },
      error: (error) => {
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
  }

  filtrarEnfermeras(): void {
    this.actualizarListasPorTurno();
  }

  filtrarPorTurno(turnoId: number | null): void {
    this.filtroTurnoId = turnoId;
    this.actualizarListasPorTurno();
  }

  cambiarTurno(enfermera: Enfermera): void {
    const index = this.enfermeras.findIndex(e => e.id === enfermera.id);
    if (index !== -1) {
      this.enfermeras[index] = { ...enfermera };
      this.enfermeras = [...this.enfermeras];
      this.actualizarListasPorTurno();
    }

    // Actualizar en backend
    this.nurseService.updateEnfermera(enfermera.id, enfermera).subscribe({
      next: () => console.log('Turno actualizado en backend'),
      error: (e) => console.error('Error al actualizar turno', e)
    });
  }

  abrirModalRemover(enfermera: Enfermera): void {
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

    this.enfermeras = this.enfermeras.filter(e => e.id !== this.enfermeraARemover?.id);
    this.actualizarListasPorTurno();
    this.cerrarModalRemover();

    console.log(`Motivo de remoción: ${this.motivoRemocion}`);
  }

  trackByEnfermeraId(index: number, enfermera: Enfermera): number {
    return enfermera.id;
  }

  generarCronograma(): void {
    alert('El cronograma se generará con los pacientes asignados y en los turnos asignados a las enfermeras');
    setTimeout(() => {
      this.router.navigate(['/cronograma'], {
        state: { enfermeras: this.enfermeras }
      });
    }, 2000);
  }
}
