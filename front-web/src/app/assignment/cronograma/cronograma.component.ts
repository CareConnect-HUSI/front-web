import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

interface Tarea {
  hora: string;
  paciente: string;
  medicamento: string;
  ubicacion: string;
}

interface Auxiliar {
  nombre: string;
  cambios: string;
  tareas: Tarea[];
}

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css']
})
export class CronogramaComponent implements OnInit {
  modoEdicion: boolean = false;

  horarios: string[] = [
    "7:00", "7:15", "7:30"
  ];

  auxiliares: Auxiliar[] = [
    {
      nombre: "PAOLA SHELEGUEL",
      cambios: "CAMBIA TURNO YEFFERSON OLIVEROS",
      tareas: [
        { hora: "7:00", paciente: "GUSTAVO PARRA", medicamento: "CADA 12", ubicacion: "B. UNIDOS" },
        { hora: "9:00", paciente: "MARCOS DIAZ", medicamento: "ASPIRINA", ubicacion: "ZONA NORTE" }
      ]
    },
    {
      nombre: "ANGIE GARZON",
      cambios: "",
      tareas: [
        { hora: "7:15", paciente: "HILLARY CONTRERAS", medicamento: "NTP 14 HORAS", ubicacion: "CORFERIAS" }
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  toggleEdicion() {
    this.modoEdicion = !this.modoEdicion;
  }

  getTareaPorHora(auxiliar: Auxiliar, hora: string): Tarea | null {
    return auxiliar.tareas.find(t => t.hora === hora) || null;
  }

  getTareaArray(auxiliar: Auxiliar, hora: string): Tarea[] {
    const tarea = this.getTareaPorHora(auxiliar, hora);
    return tarea ? [tarea] : [];
  }

  moverTarea(event: CdkDragDrop<Tarea[]>, auxiliar: Auxiliar, nuevaHora: string) {
    if (!this.modoEdicion) return;

    const tareaMovida = event.previousContainer.data[0];

    if (this.getTareaPorHora(auxiliar, nuevaHora)) {
      alert("Solo se puede asignar un paciente por hora.");
      return;
    }
    auxiliar.tareas = auxiliar.tareas.filter(t => t !== tareaMovida);

    tareaMovida.hora = nuevaHora;
    auxiliar.tareas.push(tareaMovida);
  }
}
