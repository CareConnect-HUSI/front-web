import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InsumoService } from 'src/app/service/insumo.service';
import { PatientService } from 'src/app/service/patient.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {
  isLoading: boolean = false; // Nueva variable para el estado de carga
  idPaciente: number =  0;
  documentoPaciente: string | null = '';
  nombrePaciente: string = '';
  inventario: any[] = [];

  isEditing: boolean = false;
  listaMedicamentos: any[] = [];

  showEditModal: boolean = false;
  showMedicationWarning: boolean = false;
  medicationMessage: string = '';

  currentMedication: any = {};
  currentIndex: number = -1;

  constructor(
    private route: ActivatedRoute,
    private insumoService: InsumoService,
    private stockService: StockService,
    private pacienteService: PatientService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.idPaciente = +idParam; // Convert string to number
      this.loadPatientData(this.idPaciente);
      this.loadInventario(this.idPaciente);
    } else {
      this.isLoading = false;
      console.log("ID paciente no  encontrado");

      this.medicationMessage = 'No se proporcionó un ID de paciente.';
    }
    
    this.loadMedicamentos();
  }

  loadPatientData(id: number): void {
    this.pacienteService.obtenerPacientePorId(id).subscribe({
      next: (patient: any) => {
        this.nombrePaciente = patient.nombre;
        this.documentoPaciente = patient.numeroIdentificacion; 
      },
      error: (err) => {
        console.error('Error al cargar datos del paciente:', err);
        this.nombrePaciente = '';
        this.documentoPaciente = '';
        this.medicationMessage = 'Error al cargar los datos del paciente.';
      }
    });
  }

  loadMedicamentos(): void {
    this.stockService.getListaMedicamentos().subscribe({
      next: (data: any[]) => {
        // Filtrar solo medicamentos activos
        this.listaMedicamentos = data;
      },
      error: (err) => {
        console.error('Error al cargar medicamentos:', err);
        this.listaMedicamentos = [];
      }
    });
  }

  loadInventario(id: number) {
    this.insumoService.getMedicamentosPorPaciente(id).subscribe({
      next: (data: any[]) => {
        this.inventario = data.map(act => ({
          nombre: act.nombre,
          cantidad: act.cantidad,
          usado: 0, //Todavía no carga de la BD
        }));
        this.isLoading = false; 
      },
      error: (err) => {
        console.error('Error al cargar inventario:', err);
        this.isLoading = false; // Desactivar el loading al recibir los datos
        this.medicationMessage = 'Error al cargar el inventario. Intente de nuevo.';

      }
    });
  }

  isLowStock(item: any): boolean {
    return item.cantidad - item.usado <= item.cantidad * 0.3;
  }

  openEditModal(med: any = null, index: number = -1): void {
    if (med) {
      this.isEditing = true;
      this.currentMedication = { ...med };
      this.currentIndex = index;
    } else {
      this.isEditing = false;
      this.currentMedication = {
        nombre: '',
        dosis: '',
        frecuencia: '',
        cantidad: 1,
        fechaInicio: '',
        fechaFin: '',
        diasTratamiento: 0,
      };
    }
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  updateTotal(item: any): void {
    if (item.cantidad < 1) {
      alert('La cantidad debe ser al menos 1.');
      item.cantidad = 1;
    }
  }

  saveMedication(): void {
    if (this.isEditing) {
      this.inventario[this.currentIndex] = { ...this.currentMedication };
    } else {
      this.inventario.push({ ...this.currentMedication });
    }
    this.closeEditModal();
  }

  addMedication() {
    this.openEditModal();
  }
}
