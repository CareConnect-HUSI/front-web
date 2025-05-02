import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StockService } from 'src/app/service/stock.service';

interface tipoActividad {
  id: number;
  name: string;
}
interface Producto {
  codigo?: string;
  nombre: string;
  descripcion?: string;
  tipo: tipoActividad;
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
  isLoading: boolean = false;
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
    this.isLoading = true;
    this.stockService.findAll().subscribe(
      (data: any) => {
        this.actividades = data;
        this.actividadesFiltrados = [...this.actividades];
        this.dividirActividades();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar actividades:', error);
        this.isLoading = false;
      }
    );
  }

  dividirActividades() {
    this.medicamentos = [];
    this.procedimientos = [];

    this.actividades.forEach((actividad) => {
      const producto: Producto = {
        codigo: actividad.id.toString(),
        nombre: actividad.name,
        descripcion: actividad.descripcion || '',
        tipo: {
          id: actividad.tipoActividad.id,
          name: actividad.tipoActividad.name
        }
      };

      if (actividad.tipoActividad.id === 1 && actividad.estado == "Activo") {
        this.medicamentos.push(producto);
      } else if (actividad.tipoActividad.id === 2 && actividad.estado == "Activo") {
        this.procedimientos.push(producto);
      }
    });

    this.productosActuales =
      this.tabActiva === 'medicamentos'
        ? [...this.medicamentos]
        : [...this.procedimientos];
    this.productosFiltrados = [...this.productosActuales];
  }

  productosActuales: Producto[] = [...this.medicamentos];
  productosFiltrados: Producto[] = [...this.medicamentos];

  nuevoProducto: Producto = {
    nombre: '',
    tipo: { id: 1, name: 'Medicamento' }
  };

  productoSeleccionado: Producto | null = null;

  mostrarError: boolean = false;
  mensajeError: string = '';

  mostrarFormulario: boolean = false;

  tabActiva: string = 'medicamentos';

  cambiarTab(tab: string) {
    this.tabActiva = tab;
    this.productosActuales =
      tab === 'medicamentos'
        ? [...this.medicamentos]
        : [...this.procedimientos];
    this.filtrarProductos();
    this.productoSeleccionado = null;
  }

  filtrarProductos() {
    const filtroLower = this.filtro.toLowerCase();
    this.productosFiltrados = this.productosActuales.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(filtroLower) ||
        (producto.descripcion &&
          producto.descripcion.toLowerCase().includes(filtroLower)) ||
        producto.tipo.name.toLowerCase().includes(filtroLower)
    );
  }

  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarError = false;
    this.mensajeError = '';
    if (!this.mostrarFormulario) {
      this.nuevoProducto = { nombre: '', tipo: { id: 1, name: 'Medicamento' } };
    }
  }

  camposLlenos(): boolean {
    return (
      this.nuevoProducto.nombre.trim() !== '' &&
      this.nuevoProducto.tipo.name.trim() !== ''
    );
  }

  agregarProducto() {
    if (!this.camposLlenos()) {
      this.mostrarError = true;
      this.mensajeError = 'Por favor complete todos los campos obligatorios';
      return;
    }

    this.stockService.registrarActividad(this.nuevoProducto).subscribe({
      next: (response) => {
        console.log('Actividad registrada:', response);
        this.loadActividades();
        this.filtrarProductos();
        this.toggleFormulario();
        this.mostrarError = false;
        this.nuevoProducto = {
          nombre: '',
          tipo: { id: 1, name: 'Medicamento' }
        };
        this.mostrarMensajeExito('Producto registrado correctamente');
      },
      error: (error) => {
        this.mostrarError = true;
        this.mensajeError =
          error.error || 'Error al registrar la actividad';
        console.error('Error en registrarActividad:', error);
      },
    });
  }

  solicitarConfirmacionEliminar(event: Event, producto: Producto) {
    event.stopPropagation();
    this.confirmacionEliminar = {
      mostrar: true,
      mensaje: `¿Estás seguro que deseas eliminar el ${producto.tipo.name.toLowerCase()} ${
        producto.nombre
      }?`,
      producto: producto,
    };
  }

  confirmarEliminacion(confirmar: boolean) {
    if (confirmar && this.confirmacionEliminar.producto) {
      const productoEliminar = this.confirmacionEliminar.producto;
      this.stockService.eliminarActividad(Number(productoEliminar.codigo)).subscribe({
        next: () => {
          this.mostrarMensajeExito('Producto eliminado correctamente');
          this.loadActividades(); // recarga la lista para reflejar el cambio
          this.confirmacionEliminar = { mostrar: false, mensaje: '', producto: undefined };
        },
        error: (error) => {
          this.mostrarError = true;
          this.mensajeError = error.message || 'Error al eliminar el producto';
          console.error('Error en eliminarActividad:', error);
        },
      });
    }
  }

  mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    this.mostrarExito = true;
    setTimeout(() => {
      this.mostrarExito = false;
    }, 3000);
  }
}