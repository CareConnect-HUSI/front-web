import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nurses-assignment',
  templateUrl: './nurses-assignment.component.html',
  styleUrls: ['./nurses-assignment.component.css']
})
export class NursesAssignmentComponent implements OnInit {
  enfermeraId: string | null = null;
  enfermeraNombre: string = "Enfermera Desconocida";
  
  // Filtros
  filtroPaciente: string = '';
  mesSeleccionado: string = '';
  anioSeleccionado: string = '';
  fechaEspecifica: string = '';
  asignacionesFiltradas: any[] = [];
  
  // Opciones para filtros
  meses = [
    { value: '1', nombre: 'Enero' },
    { value: '2', nombre: 'Febrero' },
    { value: '3', nombre: 'Marzo' },
    { value: '4', nombre: 'Abril' },
    { value: '5', nombre: 'Mayo' },
    { value: '6', nombre: 'Junio' },
    { value: '7', nombre: 'Julio' },
    { value: '8', nombre: 'Agosto' },
    { value: '9', nombre: 'Septiembre' },
    { value: '10', nombre: 'Octubre' },
    { value: '11', nombre: 'Noviembre' },
    { value: '12', nombre: 'Diciembre' }
  ];
  
  anios = ['2023', '2024', '2025'];
  
  // Datos quemados más completos
  asignaciones = [
    { 
      id: 1,
      fecha: new Date(2024, 5, 15), // 15/Jun/2024
      hora: "08:00 AM", 
      paciente: "Juan Pérez", 
      documento: "12345678",
      direccion: "Calle 123 #45-67", 
      estado: "Completado",
      detalles: "Control postoperatorio"
    },
    { 
      id: 2,
      fecha: new Date(2024, 5, 15),
      hora: "10:00 AM", 
      paciente: "María Gómez", 
      documento: "87654321",
      direccion: "Avenida 45 #12-34", 
      estado: "Completado",
      detalles: "Aplicación de medicamentos"
    },
    { 
      id: 3,
      fecha: new Date(2024, 5, 16),
      hora: "09:30 AM", 
      paciente: "Carlos López", 
      documento: "56781234",
      direccion: "Calle 77 #22-11", 
      estado: "Completado",
      detalles: "Curar heridas"
    },
    { 
      id: 4,
      fecha: new Date(2024, 5, 17),
      hora: "02:00 PM", 
      paciente: "Ana Torres", 
      documento: "43218765",
      direccion: "Boulevard Central #100-20", 
      estado: "Completado",
      detalles: "Control de signos vitales"
    },
    { 
      id: 5,
      fecha: new Date(2024, 5, 18),
      hora: "08:30 AM", 
      paciente: "Luisa Fernández", 
      documento: "98765432",
      direccion: "Carrera 8 #15-62", 
      estado: "En proceso",
      detalles: "Toma de muestras"
    },
    { 
      id: 6,
      fecha: new Date(2024, 5, 18),
      hora: "11:00 AM", 
      paciente: "Pedro Rojas", 
      documento: "13579246",
      direccion: "Diagonal 25 #34-10", 
      estado: "Pendiente",
      detalles: "Visita de control"
    },
    { 
      id: 7,
      fecha: new Date(2024, 5, 19),
      hora: "09:00 AM", 
      paciente: "Sofía Mendoza", 
      documento: "24681357",
      direccion: "Transversal 12 #45-30", 
      estado: "Pendiente",
      detalles: "Aplicación de vacuna"
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.enfermeraId = this.route.snapshot.paramMap.get('id');
    this.enfermeraNombre = `Enfermera ${this.enfermeraId}`;
    
    // Ordenar por fecha más reciente primero y luego por hora
    this.asignaciones.sort((a, b) => {
      if (b.fecha.getTime() === a.fecha.getTime()) {
        return this.compareTime(b.hora, a.hora);
      }
      return b.fecha.getTime() - a.fecha.getTime();
    });
    
    this.asignacionesFiltradas = [...this.asignaciones];
  }
  
  // Función para comparar horas en formato "HH:MM AM/PM"
  private compareTime(timeA: string, timeB: string): number {
    const convertToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const period = time.includes('PM') && hours !== 12 ? 12 : 0;
      return (hours % 12 + period) * 60 + minutes;
    };
    
    return convertToMinutes(timeB) - convertToMinutes(timeA);
  }

  aplicarFiltros() {
    let resultados = [...this.asignaciones];
    
    // Filtro por paciente (nombre o documento)
    if (this.filtroPaciente) {
      const busqueda = this.filtroPaciente.toLowerCase();
      resultados = resultados.filter(a => 
        a.paciente.toLowerCase().includes(busqueda) || 
        a.documento.toString().includes(busqueda)
      );
    }
    
    // Filtro por mes
    if (this.mesSeleccionado) {
      resultados = resultados.filter(a => 
        (a.fecha.getMonth() + 1).toString() === this.mesSeleccionado
      );
    }
    
    // Filtro por año
    if (this.anioSeleccionado) {
      resultados = resultados.filter(a => 
        a.fecha.getFullYear().toString() === this.anioSeleccionado
      );
    }
    
    // Filtro por fecha específica
    if (this.fechaEspecifica) {
      const fechaSeleccionada = new Date(this.fechaEspecifica);
      resultados = resultados.filter(a => 
        a.fecha.toDateString() === fechaSeleccionada.toDateString()
      );
    }
    
    this.asignacionesFiltradas = resultados;
  }
  
  verDetalles(asignacion: any) {
    this.router.navigate(['/detalle-asignacion', asignacion.id]);
  }
}