import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-inventario-paciente',
  templateUrl: './inventario-paciente.component.html',
  styleUrls: ['./inventario-paciente.component.css']
})
export class InventarioComponent implements OnInit {
  filtroBusqueda: string = '';
  pacientes: any[] = [];
  pacientesFiltrados: any[] = [];
  actividades: any[] = [];
  inventarioPorPaciente: { [key: number]: any[] } = {};
  page: number = 0;
  size: number = 10;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes() {
    this.isLoading = true;
    this.patientService.findAll(this.page, this.size).subscribe({
      next: (data: any) => {
        this.pacientes = data.content;
        this.pacientesFiltrados = [...this.pacientes];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        this.isLoading = false;
      }
    });
  }


  filtrarPacientes(): void {
    if (!this.filtroBusqueda) {
      this.pacientesFiltrados = [...this.pacientes];
      return;
    }

    const busqueda = this.filtroBusqueda.toLowerCase();
    this.pacientesFiltrados = this.pacientes.filter(paciente =>
      paciente.nombre?.toLowerCase().includes(busqueda) ||
      paciente.numero_identificacion?.toString().includes(busqueda)
    );
  }

  verInventario(paciente: any) {
    this.router.navigate(['/inventario-paciente', paciente.numero_identificacion]);
  }
  

  limpiarBusqueda() {
    this.filtroBusqueda = '';
    this.pacientesFiltrados = [...this.pacientes];
  }
}
