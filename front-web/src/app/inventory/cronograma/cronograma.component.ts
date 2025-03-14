import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css']
})
export class CronogramaComponent implements OnInit {
  turnoSeleccionado: string = "mañana";
  fechaHoraActual: string = new Date().toLocaleString();
  modoEdicion: boolean = false;

  horas: { [key: string]: string[] } = {
    "mañana": ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"],
    "tarde": ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"],
    "noche": ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", 
              "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30"]
  };

  horasVisibles: string[] = this.horas["mañana"];

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
      this.horasVisibles.forEach(hora => {
        this.asignaciones[enfermera.nombre][hora] = null;
      });
    });

    // Datos de prueba
    this.asignaciones["Enfermera 1"]["07:00"] = { nombre: "Paciente A", duracion: 60 };
    this.asignaciones["Enfermera 1"]["08:00"] = { nombre: "Paciente B", duracion: 120 };
    this.asignaciones["Enfermera 1"]["09:30"] = { nombre: "Paciente C", duracion: 150 };
    this.asignaciones["Enfermera 1"]["11:30"] = { nombre: "Paciente D", duracion: 60 };

    this.asignaciones["Enfermera 2"]["07:00"] = { nombre: "Paciente E", duracion: 90 };
    this.asignaciones["Enfermera 2"]["08:30"] = { nombre: "Paciente F", duracion: 60 };
    this.asignaciones["Enfermera 2"]["10:00"] = { nombre: "Paciente G", duracion: 60 };
    this.asignaciones["Enfermera 2"]["11:00"] = { nombre: "Paciente H", duracion: 30 };
  }

  trackByEnfermera(index: number, enfermera: any): string {
    return enfermera.nombre;
  }

  trackByHora(index: number, hora: string): string {
    return hora;
  }

  modificarCronograma() {
    this.modoEdicion = true;
  }

  eliminarPaciente(enfermera: any, hora: string) {
    if (confirm("¿Estás seguro de eliminar este paciente?")) {
      this.asignaciones[enfermera.nombre][hora] = null;
    }
  }

  guardarCambios() {
    this.modoEdicion = false;
    alert("Cambios guardados correctamente.");
  }

  cerrarPanelUrgencia() {
    this.modoEdicion = false;
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

      const nuevaHoraIndex = this.horasVisibles.indexOf(nuevaHora);

      let espacioDisponible = true;
      for (let i = 0; i < celdasOcupadas; i++) {
        const horaActual = this.horasVisibles[nuevaHoraIndex + i];
        if (!horaActual || this.asignaciones[nuevaEnfermera.nombre][horaActual]) {
          espacioDisponible = false;
          break;
        }
      }

      if (espacioDisponible) {
        for (let i = 0; i < celdasOcupadas; i++) {
          const horaActual = this.horasVisibles[nuevaHoraIndex + i];
          this.asignaciones[nuevaEnfermera.nombre][horaActual] = paciente;
        }

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

        for (let j = 0; j < duracionUrgencia; j++) {
          if (i + j >= this.horasVisibles.length || this.asignaciones[enfermera.nombre][this.horasVisibles[i + j]]) {
            espacioSuficiente = false;
            break;
          }
        }

        if (espacioSuficiente) {
          for (let j = 0; j < duracionUrgencia; j++) {
            this.asignaciones[enfermera.nombre][this.horasVisibles[i + j]] = this.nuevoPaciente;
          }
          this.nuevoPaciente = { documento: "", nombre: "", direccion: "", telefono: "", horaAtencion:"", medicamento: "", procedimiento: "", duracion: 30 };
          return;
        }
      }
    }

    alert("No hay espacio disponible para la urgencia.");
  }

  correrPacientes(enfermera: any, inicio: number, duracionUrgencia: number): boolean {
    let espacioLibre = 0;
    for (let i = inicio; i < this.horasVisibles.length; i++) {
      if (!this.asignaciones[enfermera.nombre][this.horasVisibles[i]]) {
        espacioLibre++;
      } else {
        let paciente = this.asignaciones[enfermera.nombre][this.horasVisibles[i]];
        let duracionPaciente = paciente.duracion / 30;

        if (i + duracionPaciente + duracionUrgencia > this.horasVisibles.length) {
          return false;
        }

        let pacientesCorridos = this.correrPacientes(enfermera, i + duracionPaciente, duracionUrgencia);
        if (!pacientesCorridos) {
          return false;
        }

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
    if (this.pacienteHover !== paciente) {
      this.pacienteHover = paciente;
    }
  }

  ocultarInfoPaciente() {
    if (this.pacienteHover) {
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
    const duracionCeldas = this.getColspan(paciente);

    // Verificar si la celda actual es la primera de la cita
    for (let i = 1; i < duracionCeldas; i++) {
      if (this.asignaciones[enfermera.nombre][this.horasVisibles[index - i]]) {
        return false;
      }
    }

    return true;
  }

  descargarCronograma() {
    console.log("Descargando cronograma...");
  }
}