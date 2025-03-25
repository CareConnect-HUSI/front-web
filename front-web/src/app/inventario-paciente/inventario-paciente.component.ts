import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario-paciente',
  templateUrl: './inventario-paciente.component.html',
  styleUrls: ['./inventario-paciente.component.css']
})
export class InventarioComponent implements OnInit{

  filtroBusqueda: string = '';
  pacientesFiltrados: any[] = [];

  pacientes = [
    { documento: '12345678910', nombre: 'Juan Pablo Rodríguez' },
    { documento: '98765432110', nombre: 'María Fernanda López' },
    { documento: '65432198745', nombre: 'Carlos Ramírez' },
    { documento: '45612378965', nombre: 'Ana Sofía Méndez' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.pacientesFiltrados = [...this.pacientes];
  }

  filtrarPacientes(): void {
    if (!this.filtroBusqueda) {
      this.pacientesFiltrados = [...this.pacientes];
      return;
    }
    
    const busqueda = this.filtroBusqueda.toLowerCase();
    this.pacientesFiltrados = this.pacientes.filter(paciente => 
      paciente.nombre.toLowerCase().includes(busqueda) || 
      paciente.documento.toString().includes(busqueda)
    );
  }


  verInventario(paciente: any) {
    this.router.navigate(['/inventario-paciente', paciente.documento]);
  }
}
