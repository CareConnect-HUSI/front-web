import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent {
  filtro: string = '';

  pacientes = [
    { id: '1005462695', nombre: 'Luis Pérez', direccion: 'Calle 25 #15-2' },
    { id: '20514891', nombre: 'Andrés Durán', direccion: 'Carrera 27 #12-23' },
    { id: '5641658', nombre: 'Carlos Ramírez', direccion: 'Calle 15 #70-10' },
    { id: '85411645', nombre: 'Ana Sánchez', direccion: 'Carrera 15 #12-10' }
  ];

  constructor(private router: Router) {}

  pacientesFiltrados() {
    return this.pacientes.filter(paciente =>
      paciente.id.includes(this.filtro) || 
      paciente.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  regresar() {
    this.router.navigate(['/']);
  }
}
