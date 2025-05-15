import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-inventario-paciente',
  templateUrl: './inventario-paciente.component.html',
  styleUrls: ['./inventario-paciente.component.css'],
})
export class InventarioComponent implements OnInit {
  filtroBusqueda: string = '';
  pacientes: any[] = [];
  pacientesFiltrados: any[] = [];
  actividades: any[] = [];
  inventarioPorPaciente: { [key: number]: any[] } = {};
  page: number = 0;
  size: number = 6;
  isLoading: boolean = false;
  totalPacientes: number = 0;

  constructor(private router: Router, private patientService: PatientService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.patientService.findAll(0, 10000).subscribe(
      (data: any) => {
        this.pacientes = data.content;
        this.isLoading = false;
        this.aplicarFiltroYPaginacion();
      },
      (error) => {
        console.error('Error al cargar pacientes:', error);
        this.isLoading = false;
      }
    );
  }

  loadPacientes() {
    this.isLoading = true;
    this.patientService.findAll(0, 10000).subscribe(
      (data: any) => {
        this.pacientes = data.content;
        this.totalPacientes = this.pacientes.length;
        this.aplicarFiltroYPaginacion();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar pacientes:', error);
        this.isLoading = false;
      }
    );
  }

  filtrarPacientes(): void {
    this.page = 0;
    this.aplicarFiltroYPaginacion();
  }

  verInventario(paciente: any) {
    this.router.navigate(['/inventario-paciente', paciente.id]);
  }

  limpiarBusqueda() {
    this.filtroBusqueda = '';
    this.pacientesFiltrados = [...this.pacientes];
  }

  aplicarFiltroYPaginacion() {
    const filtroLower = this.filtroBusqueda.toLowerCase();

    const filtrados = this.pacientes.filter(
      (p) =>
        p.nombre.toLowerCase().includes(filtroLower) ||
        p.numero_identificacion?.toString().includes(filtroLower)
    );

    this.totalPacientes = filtrados.length;

    const inicio = this.page * this.size;
    const fin = inicio + this.size;

    this.pacientesFiltrados = filtrados.slice(inicio, fin);
  }

  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.aplicarFiltroYPaginacion();
  }
}
