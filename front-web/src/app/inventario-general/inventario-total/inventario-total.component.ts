import { Component } from '@angular/core';

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
  medicamentosFiltrados: Medicamento[] = [...this.medicamentos];

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
  mensajeError: string = '';

  // Mostrar formulario de agregar medicamento
  mostrarFormulario: boolean = false;

  // Método para filtrar medicamentos
  filtrarMedicamentos() {
    const filtroLower = this.filtro.toLowerCase();
    this.medicamentosFiltrados = this.medicamentos.filter(medicamento =>
      medicamento.codigo.toLowerCase().includes(filtroLower) ||
      medicamento.nombre.toLowerCase().includes(filtroLower) ||
      medicamento.tipo.toLowerCase().includes(filtroLower)
    );
  }

  // Método para seleccionar un medicamento
  seleccionarMedicamento(medicamento: Medicamento) {
    this.medicamentoSeleccionado = medicamento;
  }

  // Método para alternar el formulario de agregar medicamento
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarError = false;
    this.mensajeError = '';
    if (!this.mostrarFormulario) {
      this.nuevoMedicamento = { codigo: '', nombre: '', tipo: 'Oral', total: 0 };
    }
  }

  camposLlenos(): boolean {
    return this.nuevoMedicamento.codigo.trim() !== '' &&
           this.nuevoMedicamento.nombre.trim() !== '' &&
           this.nuevoMedicamento.tipo.trim() !== '' &&
           this.nuevoMedicamento.total > 0;
  }
  // Método para agregar un nuevo medicamento con validación
  agregarMedicamento() {
    if (!this.camposLlenos()) {
      this.mostrarError = true;
      this.mensajeError  = 'Por favor llenar todos los campos';
      return;
    }

    const existe = this.medicamentos.some(medicamento =>
      medicamento.codigo === this.nuevoMedicamento.codigo
    );

    if (existe) {
      this.mostrarError = true;
      this.mensajeError = 'El código del medicamento ya existe';
      return;
    }

    this.medicamentos.push({ ...this.nuevoMedicamento });
    this.filtrarMedicamentos(); // Actualizar lista filtrada
    this.toggleFormulario(); // Cerrar formulario después de agregar
  }

  // Método para eliminar un medicamento
  eliminarMedicamento(event: Event, medicamento: Medicamento) {
    event.stopPropagation(); // Evita que se active la selección de la fila

    this.medicamentos = this.medicamentos.filter(m => m !== medicamento);
    this.filtrarMedicamentos(); // Actualizar lista filtrada
    if (this.medicamentoSeleccionado === medicamento) {
      this.medicamentoSeleccionado = null; // Deseleccionar si se elimina el medicamento seleccionado
    }
  }
}
