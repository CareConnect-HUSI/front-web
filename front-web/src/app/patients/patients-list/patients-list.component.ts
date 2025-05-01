import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  filtro: string = '';
  pacientes: any[] = [];
  pacientesFiltrados: any[] = [];
  page: number = 0;
  size: number = 10;
  isLoading: boolean = false; // Nueva variable para el estado de carga

  constructor(
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes() {
    this.isLoading = true; // Activar el loading
    this.patientService.findAll(this.page, this.size).subscribe(
      (data: any) => {
        console.log('Pacientes cargados:', data);
        this.pacientes = data.content;
        this.pacientesFiltrados = [...this.pacientes];
        this.isLoading = false; // Desactivar el loading
      },
      error => {
        console.error('Error al cargar pacientes:', error);
        this.isLoading = false; // Desactivar el loading en caso de error
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

  regresar() {
    this.router.navigate(['/']);
  }
}