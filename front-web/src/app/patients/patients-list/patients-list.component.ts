import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from './../../service/patient.service';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent {
  filtro: string = '';

  pacientes: any[] = [];
  totalElements: number = 0;

  constructor(private router: Router, private patientService: PatientService) {}

  pacientesFiltrados = [...this.pacientes];


  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        console.log('Pacientes cargados:', response);
        this.pacientes = response.content;
        this.pacientesFiltrados = [...this.pacientes];
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
      }
    });
    
  }

  filtrarPacientes() {
    const texto = this.filtro.toLowerCase().trim();
  
    if (texto === '') {
      this.pacientesFiltrados = [...this.pacientes];
      return;
    }
  
    this.pacientesFiltrados = this.pacientes.filter(paciente => {
      const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
      const documento = paciente.documento?.toLowerCase();
  
      return nombreCompleto.includes(texto) || documento.includes(texto);
    });
  }
  

  regresar() {
    this.router.navigate(['/']);
  }
}
