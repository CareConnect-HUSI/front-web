import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NurseService } from 'src/app/service/nurse.service';

@Component({
  selector: 'app-lista-enfermeras',
  templateUrl: './lista-enfermeras.component.html',
  styleUrls: ['./lista-enfermeras.component.css']
})
export class ListaEnfermerasComponent implements OnInit {
  length = 0;
  pageSize = 10;
  pageIndex = 0;

  tiposEnfermeras = ["Todas", "Turno mañana", "Turno tarde", "Turno noche"];
  tipoSeleccionado = "Todas";
  mostrarDropdown = false;

  filtroBusqueda = '';
  enfermeraSeleccionada: any = null;
  mostrarModalEdicion = false;
  enfermeraEditando: any = null;

  enfermeras: any[] = [];
  enfermerasFiltradas: any[] = [];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private nurseService: NurseService
  ) {}

  ngOnInit(): void {
    this.getEnfermeras(this.pageIndex, this.pageSize);
  }

  getEnfermeras(page: number, limit: number): void {
    this.isLoading = true; // Activar el loading
    this.nurseService.findAll(page, limit).subscribe({
      next: (data) => {
        console.log('Enfermeras cargadas:', data);
        this.enfermeras = data.content;
        this.enfermerasFiltradas = [...this.enfermeras];
        this.length = data.totalElements;
        this.isLoading = false; // Desactivar el loading
      },
      error: (error) => {
        console.error('Error cargando enfermeras:', error);
        this.isLoading = false; // Desactivar el loading en caso de error
      }
    });
  }

  handlePageEvent(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEnfermeras(this.pageIndex, this.pageSize);
  }

  seleccionarEnfermera(enfermera: any) {
    this.enfermeraSeleccionada = enfermera;
    this.router.navigate(['/nurses-assignment', enfermera.id]);
  }

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }

  filtrarPorTurno(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.mostrarDropdown = false;

    if (tipo === 'Todas') {
      this.enfermerasFiltradas = [...this.enfermeras];
    } else {
      const turno = tipo.replace('Turno ', '').toLowerCase();
      this.enfermerasFiltradas = this.enfermeras.filter(e =>
        e.turnoEntity?.name?.toLowerCase() === turno
      );
    }

    if (this.filtroBusqueda) {
      this.filtrarEnfermeras();
    }
  }

  filtrarEnfermeras() {
    const busqueda = this.filtroBusqueda.toLowerCase();
    let resultado = [...this.enfermeras];

    if (this.tipoSeleccionado !== 'Todas') {
      const turno = this.tipoSeleccionado.replace('Turno ', '').toLowerCase();
      resultado = resultado.filter(e => e.turnoEntity?.name?.toLowerCase() === turno);
    }

    this.enfermerasFiltradas = resultado.filter(enfermera =>
      enfermera.nombre?.toLowerCase().includes(busqueda) ||
      enfermera.apellido?.toLowerCase().includes(busqueda) ||
      enfermera.numeroIdentificacion?.toString().includes(busqueda)
    );
  }

  abrirModalEdicion(enfermera: any) {
    this.enfermeraEditando = { ...enfermera };
    this.mostrarModalEdicion = true;
  }

  cerrarModalEdicion() {
    this.mostrarModalEdicion = false;
    this.enfermeraEditando = null;
  }

  guardarCambios() {
    const enfermeraActualizada = {
      ...this.enfermeraEditando,
      turnoEntity: { name: this.enfermeraEditando.turnoEntity.name },
      tipoIdentificacion: this.enfermeraEditando.tipoIdentificacion
    };

    this.nurseService.updateEnfermera(this.enfermeraEditando.id, enfermeraActualizada).subscribe({
      next: (res) => {
        console.log('Enfermera actualizada con éxito:', res);
        const index = this.enfermeras.findIndex(e => e.id === this.enfermeraEditando.id);
        if (index !== -1) {
          this.enfermeras[index] = { ...res };
          this.filtrarPorTurno(this.tipoSeleccionado);
        }
        this.cerrarModalEdicion();
      },
      error: (error) => {
        console.error('Error actualizando enfermera:', error);
        alert('Ocurrió un error al actualizar la enfermera');
      }
    });
  }
}