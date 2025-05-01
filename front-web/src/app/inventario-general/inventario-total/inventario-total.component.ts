import { Component } from '@angular/core';

interface Producto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipo: string; // 'Medicamento' o 'Procedimiento'
}
interface Confirmacion {
  mostrar: boolean;
  mensaje: string;
  producto?: Producto;
}

@Component({
  selector: 'app-inventario-total',
  templateUrl: './inventario-total.component.html',
  styleUrls: ['./inventario-total.component.css']
})

export class InventarioTotalComponent {


    confirmacionEliminar: Confirmacion = {
      mostrar: false,
      mensaje: '',
      producto: undefined
    };
    
    mostrarExito: boolean = false;
    mensajeExito: string = '';

  // Datos quemados
  medicamentos: Producto[] = [
    { codigo: 'M001', nombre: 'Paracetamol 500mg Tabletas', descripcion: 'Analgésico y antipirético', tipo: 'Medicamento' },
    { codigo: 'M002', nombre: 'Amoxicilina 250mg/5ml Suspensión', tipo: 'Medicamento' }
  ];

  procedimientos: Producto[] = [
    { codigo: 'P001', nombre: 'Radiografía de tórax', descripcion: 'PA y lateral', tipo: 'Procedimiento' },
    { codigo: 'P002', nombre: 'Electrocardiograma', tipo: 'Procedimiento' }
  ];

  // Lista actual según tab activa
  productosActuales: Producto[] = [...this.medicamentos];
  productosFiltrados: Producto[] = [...this.medicamentos];

  // Nuevo producto
  nuevoProducto: Producto = {
    codigo: '',
    nombre: '',
    tipo: 'Medicamento'
  };

  // Filtro de búsqueda
  filtro: string = '';

  // Producto seleccionado
  productoSeleccionado: Producto | null = null;

  // Control de errores
  mostrarError: boolean = false;
  mensajeError: string = '';

  // Mostrar formulario
  mostrarFormulario: boolean = false;

  // Tab activa
  tabActiva: string = 'medicamentos';

  // Método para cambiar entre tabs
  cambiarTab(tab: string) {
    this.tabActiva = tab;
    this.productosActuales = tab === 'medicamentos' ? [...this.medicamentos] : [...this.procedimientos];
    this.filtrarProductos();
    this.productoSeleccionado = null;
  }

  // Método para filtrar productos
  filtrarProductos() {
    const filtroLower = this.filtro.toLowerCase();
    this.productosFiltrados = this.productosActuales.filter(producto =>
      producto.codigo.toLowerCase().includes(filtroLower) ||
      producto.nombre.toLowerCase().includes(filtroLower) ||
      (producto.descripcion && producto.descripcion.toLowerCase().includes(filtroLower)) ||
      producto.tipo.toLowerCase().includes(filtroLower)
    );
  }

  // Método para seleccionar un producto
  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
  }

  // Método para alternar el formulario
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarError = false;
    this.mensajeError = '';
    if (!this.mostrarFormulario) {
      this.nuevoProducto = { codigo: '', nombre: '', tipo: 'Medicamento' };
    }
  }

  camposLlenos(): boolean {
    return this.nuevoProducto.codigo.trim() !== '' &&
           this.nuevoProducto.nombre.trim() !== '' &&
           this.nuevoProducto.tipo.trim() !== '';
  }

  // Método para agregar un nuevo producto
  agregarProducto() {
    if (!this.camposLlenos()) {
      this.mostrarError = true;
      this.mensajeError = 'Por favor complete todos los campos obligatorios';
      return;
    }

    // Verificar si el código ya existe en medicamentos o procedimientos
    const codigoExiste = [...this.medicamentos, ...this.procedimientos].some(
      producto => producto.codigo === this.nuevoProducto.codigo
    );

    if (codigoExiste) {
      this.mostrarError = true;
      this.mensajeError = 'El código del producto ya existe';
      return;
    }

    // Agregar al array correspondiente según el tipo
    if (this.nuevoProducto.tipo === 'Medicamento') {
      this.medicamentos.push({ ...this.nuevoProducto });
    } else {
      this.procedimientos.push({ ...this.nuevoProducto });
    }

    // Actualizar la vista
    this.filtrarProductos();
    this.toggleFormulario();
  }

  // Método para eliminar un producto
  solicitarConfirmacionEliminar(event: Event, producto: Producto) {
    event.stopPropagation();
    this.confirmacionEliminar = {
      mostrar: true,
      mensaje: `¿Estás seguro que deseas eliminar el ${producto.tipo.toLowerCase()} ${producto.nombre}?`,
      producto: producto
    };
  }

  confirmarEliminacion(confirmar: boolean) {
    if (confirmar && this.confirmacionEliminar.producto) {
      const producto = this.confirmacionEliminar.producto;
      
      if (producto.tipo === 'Medicamento') {
        this.medicamentos = this.medicamentos.filter(m => m.codigo !== producto.codigo);
      } else {
        this.procedimientos = this.procedimientos.filter(p => p.codigo !== producto.codigo);
      }

      // Actualizar lista
      this.filtrarProductos();
      
      // Deseleccionar si es el producto seleccionado
      if (this.productoSeleccionado?.codigo === producto.codigo) {
        this.productoSeleccionado = null;
      }

      // Mostrar mensaje de éxito
      this.mostrarMensajeExito(`${producto.tipo} eliminado correctamente`);
    }
    
    // Cerrar diálogo de confirmación
    this.confirmacionEliminar.mostrar = false;
  }

  mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    this.mostrarExito = true;
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      this.mostrarExito = false;
    }, 3000);
  }
}
