import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CdkDragStart, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CronogramaComponent implements OnInit {
  turnoSeleccionado: string = "mañana"; // Turno inicial
  fechaHoraActual: string = new Date().toLocaleString(); // Fecha y hora actual
  modoEdicion: boolean = false;

  horas: { [key: string]: string[] } = {
    "mañana": ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"],
    "tarde": ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"],
    "noche": ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", 
              "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30"]
  };

  horasVisibles: string[] = this.horas["mañana"]; // Horas iniciales según turno

  enfermeras = [
    { nombre: "Enfermera 1" },
    { nombre: "Enfermera 2" },
    { nombre: "Enfermera 3" },
    { nombre: "Enfermera 4" }
  ];

  medicamentos = ["Paracetamol", "Ibuprofeno", "Antibiótico", "Analgésico"];
  procedimientos = ["Curación", "Vacunación", "Sutura", "Terapia"];

  asignaciones: { [key: string]: any[] } = {}; 
  nuevoPaciente = { documento: "", nombre: "", direccion: "", telefono: "", horaAtencion:"", medicamento: "", procedimiento: "", duracion: 30 };
  pacienteHover: any = null;

  

  ngOnInit() {
    setInterval(() => {
      this.fechaHoraActual = new Date().toLocaleString();
    }, 1000);
  }

  
    constructor() {
      this.inicializarAsignaciones();
    }

    // Método para agregar un paciente usando un índice numérico
  agregarPaciente(enfermera: string, index: number, paciente: any) {
    if (index >= 0 && index < this.horasVisibles.length) {
      this.asignaciones[enfermera][index] = paciente;
    } else {
      console.error(`Índice ${index} fuera de rango.`);
    }
  }

  // Inicializar asignaciones con datos de prueba
  inicializarAsignaciones() {
    this.enfermeras.forEach(enfermera => {
      this.asignaciones[enfermera.nombre] = new Array(this.horasVisibles.length).fill(null);
    });

    // Datos de prueba usando índices numéricos
    this.agregarPaciente("Enfermera 1", 0, { nombre: "Paciente A", direccion: "Calle 123", telefono: "123456789", duracion: 60 });
    this.agregarPaciente("Enfermera 1", 1, { nombre: "Paciente B", direccion: "Carrera 789", telefono: "321654987", duracion: 90 });
    this.agregarPaciente("Enfermera 1", 2, { nombre: "Paciente C", direccion: "Calle 321", telefono: "654987321", duracion: 60 });

    this.agregarPaciente("Enfermera 2", 0, { nombre: "Paciente E", direccion: "Avenida 456", telefono: "987654321", duracion: 90 });
    this.agregarPaciente("Enfermera 2", 1, { nombre: "Paciente F", direccion: "Avenida 987", telefono: "147258369", duracion: 60 });
    this.agregarPaciente("Enfermera 2", 2, { nombre: "Paciente G", direccion: "Calle 654", telefono: "369852147", duracion: 60 });

    this.agregarPaciente("Enfermera 3", 0, { nombre: "Paciente I", direccion: "Carrera 159", telefono: "258147369", duracion: 90 });
    this.agregarPaciente("Enfermera 3", 1, { nombre: "Paciente J", direccion: "Avenida 753", telefono: "852369741", duracion: 90 });
    this.agregarPaciente("Enfermera 3", 2, { nombre: "Paciente K", direccion: "Calle 951", telefono: "741852963", duracion: 60 });

    this.agregarPaciente("Enfermera 4", 0, { nombre: "Paciente M", direccion: "Carrera 357", telefono: "963852741", duracion: 120 });
    this.agregarPaciente("Enfermera 4", 1, { nombre: "Paciente N", direccion: "Avenida 258", telefono: "159753486", duracion: 60 });
  }

  // Método para determinar si una celda debe mostrarse
  debeMostrarCelda(enfermera: any, index: number): boolean {
    const paciente = this.asignaciones[enfermera.nombre][index];
    if (!paciente) return true;

    const duracionCeldas = paciente.duracion / 30;

    // Verificar si la celda debe mostrarse
    return index % duracionCeldas === 0;
  }

    
    // Método para convertir una hora en formato string a un índice numérico
  convertirHoraAIndice(hora: string): number {
    return this.horasVisibles.indexOf(hora);
  }


  trackByEnfermera(index: number, enfermera: any): string {
    return enfermera.nombre; // Usar un identificador único para cada enfermera
}

trackByHora(index: number, hora: string): string {
    return hora; // Usar la hora como identificador único
}
  modificarCronograma() {
    this.modoEdicion = true; // Cambia al modo de edición
}
mostrarInfoPaciente(paciente: any) {
  if(this.pacienteHover !== paciente){
    this.pacienteHover = paciente;
  }
}

ocultarInfoPaciente() {
  if(this.pacienteHover){
    this.pacienteHover = null;
  }
  
}


getColspan(paciente: any): number {
    if (!paciente) return 1;
    return Math.ceil(paciente.duracion / 30);
}

descargarCronograma() {
  console.log("Descargando cronograma...");
  // Lógica para descargar cronograma
}

eliminarPaciente(enfermera: any, index: number) {
  if (confirm("¿Estás seguro de eliminar este paciente?")) {
      this.asignaciones[enfermera.nombre][index] = null;
  }
}

guardarCambios() {
    this.modoEdicion = false; // Vuelve al modo de solo lectura
    alert("Cambios guardados correctamente.");
}


cerrarPanelUrgencia() {
  this.modoEdicion = false; // Vuelve al modo de solo lectura
}

  cambiarTurno() {
    this.horasVisibles = this.horas[this.turnoSeleccionado];
  }

  permitirSoltar(event: DragEvent) {
    event.preventDefault();
  }
  
  arrastrarPaciente(event: CdkDragStart, enfermera: any, index: number) {
    const paciente = this.asignaciones[enfermera.nombre][index];
    if (paciente) {
      event.source.data = { enfermera: enfermera.nombre, index, paciente };
    }
  }
  
  soltarPaciente(event: CdkDragDrop<any[]>, nuevaEnfermera: any, nuevaIndex: number) {
    const data = event.item.data;
    if (!data) return;
  
    const { enfermera, index, paciente } = data;
  
    if (enfermera === nuevaEnfermera.nombre && index === nuevaIndex) {
      return; // No hacer nada si se suelta en la misma posición
    }
  
    // Verificar si hay espacio disponible en la nueva ubicación
    const duracion = paciente.duracion / 30;
    let espacioDisponible = true;
    for (let i = 0; i < duracion; i++) {
      if (nuevaIndex + i >= this.horasVisibles.length || this.asignaciones[nuevaEnfermera.nombre][nuevaIndex + i]) {
        espacioDisponible = false;
        break;
      }
    }
  
    if (espacioDisponible) {
      // Mover el paciente a la nueva ubicación
      for (let i = 0; i < duracion; i++) {
        this.asignaciones[nuevaEnfermera.nombre][nuevaIndex + i] = paciente;
      }
  
      // Limpiar las celdas anteriores
      for (let i = 0; i < duracion; i++) {
        this.asignaciones[enfermera][index + i] = null;
      }
    } else {
      alert("No hay espacio disponible para mover al paciente.");
    }
  }
 
agregarUrgencia() {
  if (!this.nuevoPaciente.nombre || !this.nuevoPaciente.direccion || !this.nuevoPaciente.duracion) {
    alert("Ingrese todos los datos del paciente.");
    return;
  }

  const horaAtencion = this.nuevoPaciente.horaAtencion;
  const duracionUrgencia = this.nuevoPaciente.duracion / 30;
  const horaIndex = this.horasVisibles.indexOf(horaAtencion);

  if (horaIndex === -1) {
    alert("Hora de atención no válida.");
    return;
  }

  for (let enfermera of this.enfermeras) {
    let espacioSuficiente = true;

    // Verificar si hay espacio suficiente para la urgencia
    for (let i = 0; i < duracionUrgencia; i++) {
      if (horaIndex + i >= this.horasVisibles.length || this.asignaciones[enfermera.nombre][horaIndex + i]) {
        espacioSuficiente = false;
        break;
      }
    }

    if (espacioSuficiente) {
      // Asignar la urgencia
      for (let i = 0; i < duracionUrgencia; i++) {
        this.asignaciones[enfermera.nombre][horaIndex + i] = this.nuevoPaciente;
      }

      // Limpiar el objeto nuevoPaciente
      this.nuevoPaciente = { documento: "", nombre: "", direccion: "", telefono: "", horaAtencion: "", medicamento: "", procedimiento: "", duracion: 30 };
      return;
    }
  }

  alert("No hay espacio disponible para la urgencia.");
}
}
