import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StockService } from 'src/app/service/stock.service';

interface Producto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
}
interface Confirmacion {
  mostrar: boolean;
  mensaje: string;
  producto?: Producto;
}

@Component({
  selector: 'app-inventario-total',
  templateUrl: './inventario-total.component.html',
  styleUrls: ['./inventario-total.component.css'],
})
export class InventarioTotalComponent {
  filtro: string = '';
  actividades: any[] = [];
  actividadesFiltrados: any[] = [];
  page: number = 0;
  size: number = 10;
  isLoading: boolean = false; // Nueva variable para el estado de carga
  filtroBusqueda: string = '';
  medicamentos: Producto[] = [];
  procedimientos: Producto[] = [];

  confirmacionEliminar: Confirmacion = {
    mostrar: false,
    mensaje: '',
    producto: undefined,
  };

  constructor(private router: Router, private stockService: StockService) {}

  mostrarExito: boolean = false;
  mensajeExito: string = '';

  ngOnInit(): void {
    this.loadActividades();
  }

  loadActividades() {
    this.isLoading = true; // Activar el loading
    this.stockService.findAll().subscribe(
      (data: any) => {
        this.actividades = data;
        this.actividadesFiltrados = [...this.actividades];
        this.dividirActividades(); // Procesar actividades después de cargarlas
        this.isLoading = false; // Desactivar el loading
      },
      (error) => {
        console.error('Error al cargar actividades:', error);
        this.isLoading = false; // Desactivar el loading en caso de error
      }
    );
  }

  dividirActividades() {
    // Limpiar arreglos existentes
    this.medicamentos = [];
    this.procedimientos = [];

    // Mapear actividades a formato Producto y dividirlas
    this.actividades.forEach((actividad) => {
      const producto: Producto = {
        codigo: actividad.id.toString(), // Usar id como código
        nombre: actividad.name,
        descripcion: actividad.descripcion || '',
        tipo: actividad.tipoActividad.id === 2 ? 'Medicamento' : 'Procedimiento',
      };

      if (actividad.tipoActividad.id === 2) {
        this.medicamentos.push(producto);
      } else if (actividad.tipoActividad.id === 1) {
        this.procedimientos.push(producto);
      }
    });

    // Actualizar productos actuales y filtrados según la tab activa
    this.productosActuales =
      this.tabActiva === 'medicamentos'
        ? [...this.medicamentos]
        : [...this.procedimientos];
    this.productosFiltrados = [...this.productosActuales];
  }

  // Lista actual según tab activa
  productosActuales: Producto[] = [...this.medicamentos];
  productosFiltrados: Producto[] = [...this.medicamentos];

  // Nuevo producto
  nuevoProducto: Producto = {
    codigo: '',
    nombre: '',
    tipo: 'Medicamento',
  };

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
    this.productosActuales =
      tab === 'medicamentos'
        ? [...this.medicamentos]
        : [...this.procedimientos];
    this.filtrarProductos();
    this.productoSeleccionado = null;
  }

  // Método para filtrar productos
  filtrarProductos() {
    const filtroLower = this.filtro.toLowerCase();
    this.productosFiltrados = this.productosActuales.filter(
      (producto) =>
        producto.codigo.toLowerCase().includes(filtroLower) ||
        producto.nombre.toLowerCase().includes(filtroLower) ||
        (producto.descripcion &&
          producto.descripcion.toLowerCase().includes(filtroLower)) ||
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
    return (
      this.nuevoProducto.codigo.trim() !== '' &&
      this.nuevoProducto.nombre.trim() !== '' &&
      this.nuevoProducto.tipo.trim() !== ''
    );
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
      (producto) => producto.codigo === this.nuevoProducto.codigo
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
      mensaje: `¿Estás seguro que deseas eliminar el ${producto.tipo.toLowerCase()} ${
        producto.nombre
      }?`,
      producto: producto,
    };
  }

  confirmarEliminacion(confirmar: boolean) {
    if (confirmar && this.confirmacionEliminar.producto) {
      const producto = this.confirmacionEliminar.producto;

      if (producto.tipo === 'Medicamento') {
        this.medicamentos = this.medicamentos.filter(
          (m) => m.codigo !== producto.codigo
        );
      } else {
        this.procedimientos = this.procedimientos.filter(
          (p) => p.codigo !== producto.codigo
        );
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
