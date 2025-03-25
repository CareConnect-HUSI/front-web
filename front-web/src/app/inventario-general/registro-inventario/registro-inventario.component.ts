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
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mostrarError: boolean = false;
  procedimientoSeleccionado: any = null;

  procedimientos = [
    { codigo: 'PROC001', abreviatura: 'HEMO', descripcion: 'Hemograma completo' },
    { codigo: 'PROC002', abreviatura: 'GLIC', descripcion: 'Prueba de glicemia' },
    { codigo: 'PROC003', abreviatura: 'RADI', descripcion: 'Radiografía de tórax' },
    { codigo: 'PROC004', abreviatura: 'ECG', descripcion: 'Electrocardiograma' },
    { codigo: 'PROC005', abreviatura: 'URAN', descripcion: 'Análisis de orina' }
  ];
  // Lista filtrada de procedimientos
  procedimientosFiltrados: any[] = [];

  // Nuevo procedimiento
  nuevoProcedimiento: Procedimiento = {
    codigo: '',
    abreviatura: '',
    descripcion: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.filtrarProcedimientos();
  }

  // Método para filtrar procedimientos
  filtrarProcedimientos(): void {
    if (!this.filtro) {
      this.procedimientosFiltrados = [...this.procedimientos];
      return;
    }
    const busqueda = this.filtro.toLowerCase();
    this.procedimientosFiltrados = this.procedimientos.filter(procedimiento =>
      procedimiento.codigo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      procedimiento.abreviatura.toLowerCase().includes(this.filtro.toLowerCase()) ||
      procedimiento.descripcion.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  seleccionarProcedimiento(procedimiento: any): void {
    this.procedimientoSeleccionado = procedimiento;
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarError = false;
    if (!this.mostrarFormulario) {
      this.resetFormulario();
    }
  }
  resetFormulario(): void {
    this.nuevoProcedimiento = {
      codigo: '',
      abreviatura: '',
      descripcion: ''
    };
  }
  // Método para agregar un nuevo procedimiento
  agregarProcedimiento(): void {
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
  eliminarProcedimiento(event: Event, procedimiento: any): void {
    event.stopPropagation(); // Evitar que se active el click en la fila
    
    // Confirmar eliminación (puedes usar un modal de confirmación en lugar de confirm)
    if (confirm(`¿Está seguro que desea eliminar el procedimiento ${procedimiento.codigo}?`)) {
      const index = this.procedimientos.findIndex(p => p.codigo === procedimiento.codigo);
      if (index !== -1) {
        this.procedimientos.splice(index, 1);
        this.filtrarProcedimientos();
        
        // Si el procedimiento eliminado era el seleccionado, limpiar la selección
        if (this.procedimientoSeleccionado?.codigo === procedimiento.codigo) {
          this.procedimientoSeleccionado = null;
        }
      }
    }
  }
}