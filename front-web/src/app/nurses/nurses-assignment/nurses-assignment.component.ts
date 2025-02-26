import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nurses-assignment',
  templateUrl: './nurses-assignment.component.html',
  styleUrls: ['./nurses-assignment.component.css']
})
export class NursesAssignmentComponent implements OnInit {
  enfermeraId: string | null = null;
  enfermeraNombre: string = "Enfermera Desconocida"; // Valor por defecto
  asignaciones = [
    { hora: "08:00 AM", paciente: "Juan Pérez", direccion: "Calle 123", estado: "Pendiente" },
    { hora: "10:00 AM", paciente: "María Gómez", direccion: "Avenida 45", estado: "Completado" },
    { hora: "01:00 PM", paciente: "Carlos López", direccion: "Calle 77", estado: "En proceso" },
    { hora: "03:00 PM", paciente: "Ana Torres", direccion: "Boulevard Central", estado: "Pendiente" }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.enfermeraId = this.route.snapshot.paramMap.get('id');
    this.enfermeraNombre = `Enfermera ${this.enfermeraId}`; // Simulación del nombre según el ID
  }
}
