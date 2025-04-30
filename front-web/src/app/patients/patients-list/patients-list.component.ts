import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NurseService } from 'src/app/service/nurse.service';
import { PatientService } from 'src/app/service/patient.service';
@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  filtro: string = '';
  pacientesFiltrados: any[] = [];
  page: number = 0;
  size: number = 10;

  pacientes = [
    { id: '12345678910', nombre: 'Juan Pérez', direccion: 'Calle 123', estado: 'Activo' },
    { id: '789012', nombre: 'María López', direccion: 'Carrera 45', estado: 'Inactivo' },
    { id: '345678', nombre: 'Carlos Gómez', direccion: 'Avenida 10', estado: 'Activo' }
  ];

  constructor(
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes() {
        this.patientService.findAll(this.page, this.size).subscribe(
      (data: any) => {
        console.log('Pacientes cargados:', data);
        this.pacientes = data.content;
        this.pacientesFiltrados = [...this.pacientes];
      },
      error => {
        console.error('Error al cargar pacientes:', error);
      }
    );
  }

  filtrarPacientes() {
    if (!this.filtro) {
      this.pacientesFiltrados = [...this.pacientes];
      return;
    }
    
    const busqueda = this.filtro.toLowerCase();
    this.pacientesFiltrados = this.pacientes.filter(paciente => 
      paciente.nombre.toLowerCase().includes(busqueda) || 
      paciente.id.toString().includes(busqueda)
    );
  }

  toggleEstado(paciente: any): void {
    const nuevoEstado = paciente.estado === 'Activo' ? 'Inactivo' : 'Activo';
    paciente.estado = nuevoEstado; // Actualizar el estado localmente
    console.log(`Estado del paciente ${paciente.id} cambiado a ${nuevoEstado}`);
  }

  regresar() {
    this.router.navigate(['/cronograma']);
  }
}