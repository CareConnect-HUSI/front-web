import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css']
})
export class CronogramaComponent implements OnInit {
  horarios: string[] = ["7:00", "7:15", "7:30", "7:45", "8:00", "8:15", "8:30", "8:45", "9:00", "9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15"];
  
  auxiliares = [
    {
      nombre: "PAOLA SHELEGUEL",
      cambios: "CAMBIA TURNO YEFFERSON OLIVEROS",
      tareas: [
        { hora: "7:00", paciente: "GUSTAVO PARRA", medicamento: "CADA 12", ubicacion: "B. UNIDOS" },
        { hora: "8:00", paciente: "LIAM SMITH PARDO", medicamento: "NTP 12HR", ubicacion: "LA GRANJA" }
      ]
    },
    {
      nombre: "ANGIE GARZON",
      cambios: "",
      tareas: [
        { hora: "9:15", paciente: "HILLARY CONTRERAS", medicamento: "NTP 14 HORAS", ubicacion: "CORFERIAS" }
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  getTarea(auxiliar: any, hora: string) {
  return auxiliar.tareas.find((t: any) => t.hora === hora);
  }

}
