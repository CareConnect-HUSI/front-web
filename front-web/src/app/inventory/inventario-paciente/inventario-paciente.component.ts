import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario-paciente',
  templateUrl: './inventario-paciente.component.html',
  styleUrls: ['./inventario-paciente.component.css']
})
export class InventarioComponent {

  pacientes = [
    { documento: '12345678910', nombre: 'Juan Pablo Rodríguez' },
    { documento: '98765432110', nombre: 'María Fernanda López' },
    { documento: '65432198745', nombre: 'Carlos Ramírez' },
    { documento: '45612378965', nombre: 'Ana Sofía Méndez' }
  ];

  constructor(private router: Router) {}

  verInventario(paciente: any) {
    this.router.navigate(['/inventario-paciente', paciente.documento]);
  }
}
