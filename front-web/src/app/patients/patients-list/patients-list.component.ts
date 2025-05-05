import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';
import { PageEvent } from '@angular/material/paginator';

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
  size: number = 5;
  totalPacientes: number = 0;
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
  
    this.patientService.findAll(this.page, this.size).subscribe(
      (data: any) => {
        this.pacientes = data.content;
        this.totalPacientes = data.totalElements;
        this.pacientesFiltrados = [...this.pacientes];
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar pacientes:', error);
        this.isLoading = false;
      }
    );
  }
  

  aplicarFiltroYPaginacion() {
    const filtroLower = this.filtro.toLowerCase();
 
    const filtrados = this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(filtroLower) ||
      p.id.toString().includes(filtroLower)
    );
 
    this.totalPacientes = filtrados.length;

    const inicio = this.page * this.size;
    const fin = inicio + this.size;
    this.pacientesFiltrados = filtrados.slice(inicio, fin);
  }
  

  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadPacientes(); 
  }
  
  

  filtrarPacientes() {
    this.page = 0;
    this.aplicarFiltroYPaginacion();
  }
  

  toggleEstado(paciente: any): void {
    const nuevoEstado = paciente.estado === 'Activo' ? 'Inactivo' : 'Activo';
    paciente.estado = nuevoEstado;
    console.log(`Estado del paciente ${paciente.id} cambiado a ${nuevoEstado}`);
  }

  regresar() {
    this.router.navigate(['/cronograma']);
  }
}
