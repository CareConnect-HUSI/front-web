import { Component } from '@angular/core';

@Component({
  selector: 'app-inventario',
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

  verInventario(paciente: any) {
    alert(`Mostrando inventario de ${paciente.nombre}`);
  }
}
