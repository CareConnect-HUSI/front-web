import { Component } from '@angular/core';

interface Procedimiento {
  codigo: string;
  abreviatura: string;
  descripcion: string;
}
@Component({
  selector: 'app-registro-inventario',
  templateUrl: './registro-inventario.component.html',
  styleUrls: ['./registro-inventario.component.css']
})
export class RegistroInventarioComponent {
  procedimientos: Procedimiento[] = [
    { codigo: 'P001', abreviatura: 'PROC1', descripcion: 'Procedimiento 1' },
    { codigo: 'P002', abreviatura: 'PROC2', descripcion: 'Procedimiento 2' }
  ];

  // Lista filtrada de procedimientos
  procedimientosFiltrados: Procedimiento[] = this.procedimientos;

  // Nuevo procedimiento
  nuevoProcedimiento: Procedimiento = {
    codigo: '',
    abreviatura: '',
    descripcion: ''
  };

  // Filtro de búsqueda
  filtro: string = '';

  // Procedimiento seleccionado
  procedimientoSeleccionado: Procedimiento | null = null;

  // Control de errores
  mostrarError: boolean = false;

  // Método para filtrar procedimientos
  filtrarProcedimientos() {
    this.procedimientosFiltrados = this.procedimientos.filter(procedimiento =>
      procedimiento.codigo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      procedimiento.abreviatura.toLowerCase().includes(this.filtro.toLowerCase()) ||
      procedimiento.descripcion.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Método para seleccionar un procedimiento
  seleccionarProcedimiento(procedimiento: Procedimiento) {
    this.procedimientoSeleccionado = procedimiento;
  }

  // Método para agregar un nuevo procedimiento
  agregarProcedimiento() {
    const existe = this.procedimientos.some(procedimiento =>
      procedimiento.codigo === this.nuevoProcedimiento.codigo ||
      procedimiento.abreviatura === this.nuevoProcedimiento.abreviatura
    );

    if (existe) {
      this.mostrarError = true;
      setTimeout(() => this.mostrarError = false, 3000); // Ocultar mensaje después de 3 segundos
    } else {
      this.procedimientos.push({ ...this.nuevoProcedimiento });
      this.procedimientosFiltrados = this.procedimientos; // Actualizar lista filtrada
      this.nuevoProcedimiento = { codigo: '', abreviatura: '', descripcion: '' }; // Resetear formulario
    }
  }

  // Método para eliminar un procedimiento
  eliminarProcedimiento(procedimiento: Procedimiento) {
    this.procedimientos = this.procedimientos.filter(p => p !== procedimiento);
    this.procedimientosFiltrados = this.procedimientos; // Actualizar lista filtrada
    if (this.procedimientoSeleccionado === procedimiento) {
      this.procedimientoSeleccionado = null; // Deseleccionar si se elimina el procedimiento seleccionado
    }
  }
}