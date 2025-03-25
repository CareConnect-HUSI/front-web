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
  pageSize = 4;
  pageIndex = 0;
  tiposEnfermeras = ["Todas", "Turno mañana", "Turno tarde", "Turno noche"];
  tipoSeleccionado = "Todas";
  mostrarDropdown = false;
  enfermeraSeleccionada: any = null;
  filtroBusqueda = '';
  enfermerasFiltradas: any[] = [];
  mostrarModalEdicion = false;
  enfermeraEditando: any = null;

  // Datos quemados de ejemplo con documento añadido
  enfermeras: any[] = [
    {
      id: 1,
      name: 'María',
      lastname: 'González',
      documento: '12345678',
      imagen: 'assets/images/enfermera.png',
      turno: 'Mañana',
      celular: '3022678421'
    },
    {
      id: 2,
      name: 'Carlos',
      lastname: 'Rodríguez',
      documento: '87654321',
      imagen: 'assets/images/enfermera.png',
      turno: 'Tarde',
      celular: '3028002627'
    },
    {
      id: 3,
      name: 'Ana',
      lastname: 'Martínez',
      documento: '56781234',
      imagen: 'assets/images/enfermera.png',
      turno: 'Noche',
      celular: '3028765432'
    },
    {
      id: 4,
      name: 'Juan',
      lastname: 'Pérez',
      documento: '43218765',
      imagen: 'assets/images/enfermera.png',
      turno: 'Mañana',
      celular: '3004654243'
    }
  ];

  constructor(private router: Router, private nurseService: NurseService) {}

  ngOnInit(): void {
    this.getEnfermeras(this.pageIndex, this.pageSize);
    this.enfermerasFiltradas = [...this.enfermeras];
  }

  getEnfermeras(page: number, limit: number): void {
    this.nurseService.findAll(page, limit).subscribe({
      next: (data) => {
        console.log('Enfermeras cargadas:', data);
        // Si no hay datos del servicio, usamos los datos quemados
        this.enfermeras = data.content && data.content.length > 0 ? data.content : this.enfermeras;
        this.enfermerasFiltradas = [...this.enfermeras];
        this.length = data.totalElements || this.enfermeras.length;
      },
      error: (error) => {
        console.error('Error cargando enfermeras:', error);
        // En caso de error, usamos los datos quemados
        this.enfermeras = this.enfermeras;
        this.enfermerasFiltradas = [...this.enfermeras];
        this.length = this.enfermeras.length;
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
        e.turno?.toLowerCase() === turno
      );
    }
    
    // Aplicar también el filtro de búsqueda si existe
    if (this.filtroBusqueda) {
      this.filtrarEnfermeras();
    }
  }

  filtrarEnfermeras() {
    const busqueda = this.filtroBusqueda.toLowerCase();
    
    if (!busqueda) {
      // Si no hay búsqueda, aplicar solo el filtro de turno
      this.filtrarPorTurno(this.tipoSeleccionado);
      return;
    }
    
    // Filtrar primero por turno
    let resultado = [...this.enfermeras];
    if (this.tipoSeleccionado !== 'Todas') {
      const turno = this.tipoSeleccionado.replace('Turno ', '').toLowerCase();
      resultado = resultado.filter(e => e.turno?.toLowerCase() === turno);
    }
    
    // Luego filtrar por búsqueda
    this.enfermerasFiltradas = resultado.filter(enfermera => 
      enfermera.name.toLowerCase().includes(busqueda) || 
      enfermera.lastname.toLowerCase().includes(busqueda) ||
      (enfermera.documento && enfermera.documento.toString().includes(busqueda))
    );
  }

  abrirModalEdicion(enfermera: any) {
    this.enfermeraEditando = {...enfermera};
    this.mostrarModalEdicion = true;
  }

  cerrarModalEdicion() {
    this.mostrarModalEdicion = false;
    this.enfermeraEditando = null;
  }

  guardarCambios() {
    // En una aplicación real, aquí harías una llamada al servicio para guardar los cambios
    const index = this.enfermeras.findIndex(e => e.id === this.enfermeraEditando.id);
    if (index !== -1) {
      this.enfermeras[index] = {...this.enfermeraEditando};
      this.enfermerasFiltradas = [...this.enfermeras];
      this.filtrarPorTurno(this.tipoSeleccionado);
    }
    this.cerrarModalEdicion();
  }
}