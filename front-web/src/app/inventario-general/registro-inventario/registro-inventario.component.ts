import { Component } from '@angular/core';

interface InventarioItem {
  codigo: string;
  nombre: string;
  cantidad: number;
  fecha: string;
  ingresadoPor: string;
}
@Component({
  selector: 'app-registro-inventario',
  templateUrl: './registro-inventario.component.html',
  styleUrls: ['./registro-inventario.component.css']
})
export class RegistroInventarioComponent {
  inventario: InventarioItem[] = [
    { codigo: '001', nombre: 'Guantes', cantidad: 50, fecha: '2024-02-25', ingresadoPor: 'Admin' },
    { codigo: '002', nombre: 'Mascarillas', cantidad: 100, fecha: '2024-02-24', ingresadoPor: 'Usuario1' },
    { codigo: '003', nombre: 'Alcohol', cantidad: 30, fecha: '2024-02-23', ingresadoPor: 'Usuario2' }
  ];

  nuevoItem: InventarioItem = { codigo: '', nombre: '', cantidad: 0, fecha: '', ingresadoPor: '' };

  agregarItem() {
    if (this.nuevoItem.codigo && this.nuevoItem.nombre && this.nuevoItem.cantidad > 0 && this.nuevoItem.fecha && this.nuevoItem.ingresadoPor) {
      this.inventario.push({ ...this.nuevoItem });
      this.nuevoItem = { codigo: '', nombre: '', cantidad: 0, fecha: '', ingresadoPor: '' };
    }
  }

  cargarArchivo(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo subido:', file.name);
    }
  }
}