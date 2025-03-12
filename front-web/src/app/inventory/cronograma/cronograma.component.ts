import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';


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

  asignaciones: { [key: string]: { [key: string]: any } } = {};
  nuevoPaciente = { documento: "", nombre: "", direccion: "", telefono: "", horaAtencion:"", medicamento: "", procedimiento: "", duracion: 30 };
  pacienteHover: any = null;

  constructor() {
    this.inicializarAsignaciones();
  }

  ngOnInit() {
    setInterval(() => {
      this.fechaHoraActual = new Date().toLocaleString();
    }, 1000);
  }

  inicializarAsignaciones() {
    this.enfermeras.forEach(enfermera => {
      this.asignaciones[enfermera.nombre] = {};
      Object.keys(this.horas).flat().forEach(hora => {
        this.asignaciones[enfermera.nombre][hora] = null;
      });
    });

    // Datos de prueba
    this.asignaciones["Enfermera 1"]["07:00"] = { nombre: "Paciente A", direccion: "Calle 123", telefono: "123456789", duracion: 60 };
this.asignaciones["Enfermera 1"]["08:00"] = { nombre: "Paciente B", direccion: "Carrera 789", telefono: "321654987", duracion: 90 };
this.asignaciones["Enfermera 1"]["9:30"] = { nombre: "Paciente C", direccion: "Calle 321", telefono: "654987321", duracion: 60 };
this.asignaciones["Enfermera 1"]["12:30"] = { nombre: "Paciente D", direccion: "Avenida 654", telefono: "789456123", duracion: 30 };
// Hueco de 120 min (11:45 - 1:45)

this.asignaciones["Enfermera 2"]["07:00"] = { nombre: "Paciente E", direccion: "Avenida 456", telefono: "987654321", duracion: 90 };
this.asignaciones["Enfermera 2"]["08:30"] = { nombre: "Paciente F", direccion: "Avenida 987", telefono: "147258369", duracion: 60 };
this.asignaciones["Enfermera 2"]["10:00"] = { nombre: "Paciente G", direccion: "Calle 654", telefono: "369852147", duracion: 60 };
this.asignaciones["Enfermera 2"]["11:00"] = { nombre: "Paciente H", direccion: "Carrera 789", telefono: "852741963", duracion: 30 };
// Hueco de 120 min (12:00 - 2:00)

this.asignaciones["Enfermera 3"]["07:00"] = { nombre: "Paciente I", direccion: "Carrera 159", telefono: "258147369", duracion: 90 };
this.asignaciones["Enfermera 3"]["08:30"] = { nombre: "Paciente J", direccion: "Avenida 753", telefono: "852369741", duracion: 90 };
this.asignaciones["Enfermera 3"]["10:00"] = { nombre: "Paciente K", direccion: "Calle 951", telefono: "741852963", duracion: 60 };
this.asignaciones["Enfermera 3"]["12:00"] = { nombre: "Paciente L", direccion: "Carrera 147", telefono: "357159258", duracion: 60 };
// Hueco de 120 min (11:45 - 1:45)

this.asignaciones["Enfermera 4"]["07:00"] = { nombre: "Paciente M", direccion: "Carrera 357", telefono: "963852741", duracion: 120 };
this.asignaciones["Enfermera 4"]["09:00"] = { nombre: "Paciente N", direccion: "Avenida 258", telefono: "159753486", duracion: 60 };
this.asignaciones["Enfermera 4"]["12:00"] = { nombre: "Paciente O", direccion: "Calle 147", telefono: "357159258", duracion: 30 };
// Hueco de 120 min (11:30 - 1:30)

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

eliminarPaciente(enfermera: any, hora: string) {
    if (confirm("¿Estás seguro de eliminar este paciente?")) {
        this.asignaciones[enfermera.nombre][hora] = null;
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

  arrastrarPaciente(event: DragEvent, enfermera: any, hora: string) {
    event.dataTransfer?.setData("text", JSON.stringify({ enfermera: enfermera.nombre, hora }));
  }

  permitirSoltar(event: DragEvent) {
    event.preventDefault();
  }

  soltarPaciente(event: DragEvent, nuevaEnfermera: any, nuevaHora: string) {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer?.getData("text") || "{}");
    const { enfermera, hora } = data;

    if (this.asignaciones[enfermera]?.[hora]) {
        const paciente = this.asignaciones[enfermera][hora];
        const duracion = paciente.duracion;
        const celdasOcupadas = duracion / 30;

        // Obtener el índice de la nueva hora
        const nuevaHoraIndex = this.horasVisibles.indexOf(nuevaHora);

        // Verificar si hay espacio disponible en la nueva ubicación
        let espacioDisponible = true;
        for (let i = 0; i < celdasOcupadas; i++) {

            const horaActual = this.horasVisibles[nuevaHoraIndex + i];

            if (!horaActual || this.asignaciones[nuevaEnfermera.nombre][horaActual]) {
                espacioDisponible = false;
                break;
            }
        }

        if (espacioDisponible) {
            // Mover el paciente a la nueva ubicación
            for (let i = 0; i < celdasOcupadas; i++) {
                
                const horaActual = this.horasVisibles[nuevaHoraIndex + i];

                this.asignaciones[nuevaEnfermera.nombre][horaActual] = paciente;
            }

            // Limpiar las celdas anteriores
            for (let i = 0; i < celdasOcupadas; i++) {
                const horaIndex = this.horasVisibles.indexOf(hora);
                const horaActual = this.horasVisibles[horaIndex + i];

                this.asignaciones[enfermera][horaActual] = null;
            }
        } else {
            // Intentar correr a los pacientes existentes para hacer espacio
            const pacientesCorridos = this.correrPacientes(nuevaEnfermera, nuevaHoraIndex, celdasOcupadas);
            if (pacientesCorridos) {
                // Mover el paciente a la nueva ubicación
                for (let i = 0; i < celdasOcupadas; i++) {
                   
                    const horaActual = this.horasVisibles[nuevaHoraIndex + i];

                    this.asignaciones[nuevaEnfermera.nombre][horaActual] = paciente;
                }

                // Limpiar las celdas anteriores
                for (let i = 0; i < celdasOcupadas; i++) {
                    const horaIndex = this.horasVisibles.indexOf(hora);
                    const horaActual = this.horasVisibles[horaIndex + i];

                    this.asignaciones[enfermera][horaActual] = null;
                }
            } else {
                alert("No hay espacio disponible para mover al paciente.");
            }
        }
    }
}
 
agregarUrgencia() {
  if (!this.nuevoPaciente.nombre || !this.nuevoPaciente.direccion || !this.nuevoPaciente.duracion) {
      alert("Ingrese todos los datos del paciente.");
      return;
  }

  for (let enfermera of this.enfermeras) {
      for (let i = 0; i < this.horasVisibles.length; i++) {
          let hora = this.horasVisibles[i];
          let duracionUrgencia = this.nuevoPaciente.duracion / 30;
          let espacioSuficiente = true;

          // Verificar si hay espacio suficiente para la urgencia
          for (let j = 0; j < duracionUrgencia; j++) {
              if (i + j >= this.horasVisibles.length || this.asignaciones[enfermera.nombre][this.horasVisibles[i + j]]) {
                  espacioSuficiente = false;
                  break;
              }
          }

          if (espacioSuficiente) {
              // Asignar la urgencia
              for (let j = 0; j < duracionUrgencia; j++) {
                  this.asignaciones[enfermera.nombre][this.horasVisibles[i + j]] = this.nuevoPaciente;
              }
              this.nuevoPaciente = { documento: "", nombre: "", direccion: "", telefono: "", horaAtencion:"", medicamento: "", procedimiento: "", duracion: 30};
              return;
          } else {
              // Intentar correr a los pacientes existentes para hacer espacio
              let pacientesCorridos = this.correrPacientes(enfermera, i, duracionUrgencia);
              if (pacientesCorridos) {
                  // Asignar la urgencia después de correr a los pacientes
                  for (let j = 0; j < duracionUrgencia; j++) {
                      this.asignaciones[enfermera.nombre][this.horasVisibles[i + j]] = this.nuevoPaciente;
                  }
                  this.nuevoPaciente = { documento: "", nombre: "", direccion: "", telefono: "", horaAtencion:"", medicamento: "", procedimiento: "", duracion: 30 };
                  return;
              }
          }
      }
  }

  alert("No hay espacio disponible para la urgencia.");
}
  
  correrPacientes(enfermera: any, inicio: number, duracionUrgencia: number): boolean {
    // Verificar si es posible correr a los pacientes
    let espacioLibre = 0;
    for (let i = inicio; i < this.horasVisibles.length; i++) {
        if (!this.asignaciones[enfermera.nombre][this.horasVisibles[i]]) {
            espacioLibre++;
        } else {
            // Si encontramos un paciente, verificar si podemos correrlo
            let paciente = this.asignaciones[enfermera.nombre][this.horasVisibles[i]];
            let duracionPaciente = paciente.duracion / 30;

            // Verificar si hay espacio suficiente para correr al paciente
            if (i + duracionPaciente + duracionUrgencia > this.horasVisibles.length) {
                return false; // No hay espacio suficiente
            }

            // Intentar correr al paciente
            let pacientesCorridos = this.correrPacientes(enfermera, i + duracionPaciente, duracionUrgencia);
            if (!pacientesCorridos) {
                return false; // No se pudo correr al paciente
            }

            // Mover al paciente
            for (let j = 0; j < duracionPaciente; j++) {
                this.asignaciones[enfermera.nombre][this.horasVisibles[i + j + duracionUrgencia]] = paciente;
                this.asignaciones[enfermera.nombre][this.horasVisibles[i + j]] = null;
            }

            espacioLibre += duracionUrgencia;
            break;
        }
    }

    return espacioLibre >= duracionUrgencia;
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

  debeMostrarCelda(enfermera: any, hora: string): boolean {
    const paciente = this.asignaciones[enfermera.nombre][hora];
    if (!paciente) return true;

    const index = this.horasVisibles.indexOf(hora);
    const duracionCeldas = paciente.duracion / 30;

    return index % paciente.duracion === 0;
  }
  
  descargarCronograma() {
    console.log("Descargando cronograma...");
    // Lógica para descargar cronograma
  }
 
}