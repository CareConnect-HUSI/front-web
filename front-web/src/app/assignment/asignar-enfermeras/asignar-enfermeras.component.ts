import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


interface Enfermera {
  id: number;
  nombre: string;
  documento: string;
  telefono: string;
  turnoId: number;
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

  enfermeras: Enfermera[] = [
    { id: 1, nombre: 'María González', documento: '12345678', telefono: '3022678421', turnoId: 1 },
    { id: 2, nombre: 'Carlos Rodríguez', documento: '87654321', telefono: '3028002627', turnoId: 2 },
    { id: 3, nombre: 'Ana Martinez', documento: '56781234', telefono: '3028765432', turnoId: 3 },
    { id: 4, nombre: 'Juan Pérez', documento: '43218765', telefono: '3004654243', turnoId: 1 }
  ];

  enfermerasFiltradas: Enfermera[] = [];
  enfermerasManana: Enfermera[] = [];
  enfermerasTarde: Enfermera[] = [];
  enfermerasNoche: Enfermera[] = [];
  
  filtroNombre: string = '';
  filtroTurnoId: number | null = null;
  
  mostrarModalRemover: boolean = false;
  enfermeraARemover: Enfermera | null = null;
  motivoRemocion: string = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actualizarListasPorTurno();
  }

  getNombreTurno(turnoId: number): string {
    const turno = this.turnos.find(t => t.id === turnoId);
    return turno ? turno.nombre : 'Desconocido';
  }

  filtrarEnfermeras(): void {
    this.enfermerasFiltradas = this.enfermeras.filter(enfermera => {
      const cumpleNombre = enfermera.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) || 
                          enfermera.documento.includes(this.filtroNombre);
      const cumpleTurno = this.filtroTurnoId ? enfermera.turnoId === this.filtroTurnoId : true;
      return cumpleNombre && cumpleTurno;
    });
    this.actualizarListasPorTurno();
  }

  actualizarListasPorTurno(): void {
    // Usar slice() para crear nuevos arrays y triggerear detección de cambios
    this.enfermerasManana = this.enfermeras.filter(e => e.turnoId === 1).slice();
    this.enfermerasTarde = this.enfermeras.filter(e => e.turnoId === 2).slice();
    this.enfermerasNoche = this.enfermeras.filter(e => e.turnoId === 3).slice();
}

  filtrarPorTurno(turnoId: number | null): void {
    this.filtroTurnoId = turnoId;
    this.filtrarEnfermeras();
  }

  cambiarTurno(enfermera: Enfermera): void {
    // Encuentra el índice de la enfermera en el array principal
    const index = this.enfermeras.findIndex(e => e.id === enfermera.id);
    
    if (index !== -1) {
        // Crea un nuevo objeto para triggerear la detección de cambios
        this.enfermeras[index] = {
            ...this.enfermeras[index],
            turnoId: enfermera.turnoId
        };
        
        // Forzar una nueva referencia del array
        this.enfermeras = [...this.enfermeras];
        
        // Actualizar todas las listas
        this.actualizarListasPorTurno();
        
        // Si hay filtro aplicado, mantenerlo
        if (this.filtroNombre) {
            this.filtrarEnfermeras();
        }
    }
}

  abrirModalRemover(enfermera: Enfermera): void {
    this.enfermeraARemover = enfermera;
    this.motivoRemocion = '';
    this.mostrarModalRemover = true;
  }
  trackByEnfermeraId(index: number, enfermera: Enfermera): number {
    return enfermera.id;
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
  }

  navegarARegistroEnfermera(): void {
    this.router.navigate(['/registro-enfermera']);
  }

  generarCronograma(): void {
    // Mostrar mensaje informativo
    alert('El cronograma se generará con los pacientes asignados y en los turnos asignados a las enfermeras');
  
    // Navegar después de 2 segundos para que el usuario vea el mensaje
    setTimeout(() => {
      this.router.navigate(['/cronograma'], {
        state: { enfermeras: this.enfermeras }
      });
    }, 2000);
  }
}