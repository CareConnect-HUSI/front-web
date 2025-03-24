import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Medicamento {
  codigo: string;
  nombre: string;
  tipo: string; // Oral o Inyectable
  total: number;
}

@Component({
  selector: 'app-inventario-total',
  templateUrl: './inventario-total.component.html',
  styleUrls: ['./inventario-total.component.css']
})
export class InventarioTotalComponent {
  medicamentos: Medicamento[] = [
    { codigo: 'M001', nombre: 'Paracetamol', tipo: 'Oral', total: 100 },
    { codigo: 'M002', nombre: 'Amoxicilina', tipo: 'Inyectable', total: 50 }
  ];

  // Lista filtrada de medicamentos
  medicamentosFiltrados: Medicamento[] = this.medicamentos;

  // Nuevo medicamento
  nuevoMedicamento: Medicamento = {
    codigo: '',
    nombre: '',
    tipo: 'Oral',
    total: 0
  };

  // Filtro de búsqueda
  filtro: string = '';

  // Medicamento seleccionado
  medicamentoSeleccionado: Medicamento | null = null;

  // Control de errores
  mostrarError: boolean = false;

  // Método para filtrar medicamentos
  filtrarMedicamentos() {
    this.medicamentosFiltrados = this.medicamentos.filter(medicamento =>
      medicamento.codigo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      medicamento.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      medicamento.tipo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Método para seleccionar un medicamento
  seleccionarMedicamento(medicamento: Medicamento) {
    this.medicamentoSeleccionado = medicamento;
  }

  // Método para agregar un nuevo medicamento
  agregarMedicamento() {
    const existe = this.medicamentos.some(medicamento =>
      medicamento.codigo === this.nuevoMedicamento.codigo
    );

    if (existe) {
      this.mostrarError = true;
      setTimeout(() => this.mostrarError = false, 3000); // Ocultar mensaje después de 3 segundos
    } else {
      this.medicamentos.push({ ...this.nuevoMedicamento });
      this.medicamentosFiltrados = this.medicamentos; // Actualizar lista filtrada
      this.nuevoMedicamento = { codigo: '', nombre: '', tipo: 'Oral', total: 0 }; // Resetear formulario
    }
  }

  // Método para eliminar un medicamento
  eliminarMedicamento(medicamento: Medicamento) {
    this.medicamentos = this.medicamentos.filter(m => m !== medicamento);
    this.medicamentosFiltrados = this.medicamentos; // Actualizar lista filtrada
    if (this.medicamentoSeleccionado === medicamento) {
      this.medicamentoSeleccionado = null; // Deseleccionar si se elimina el medicamento seleccionado
    }
  }
}
