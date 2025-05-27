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
  isLoading: boolean = false;
  idPaciente: number = 0;
  documentoPaciente: string | null = '';
  nombrePaciente: string = '';
  inventario: any[] = [];

  isEditing: boolean = false;
  listaMedicamentos: any[] = [];

  showEditModal: boolean = false;
  showAddModal: boolean = false;
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
      this.idPaciente = +idParam;
      this.loadPatientData(this.idPaciente);
      this.loadInventario(this.idPaciente);
    } else {
      this.isLoading = false;
      this.medicationMessage = 'No se proporcionó un ID de paciente.';
    }

    this.loadMedicamentos();
  }

  loadPatientData(id: number): void {
    this.pacienteService.obtenerPacientePorId(id).subscribe({
      next: (patient: any) => {
        console.log('Datos del paciente:', patient);
        this.nombrePaciente = patient.nombre || '';
        this.documentoPaciente = patient.numeroIdentificacion || '';
      },

      error: (err) => {
        console.error('Error al cargar datos del paciente:', err);
        this.nombrePaciente = '';
        this.documentoPaciente = '';
        this.medicationMessage = 'Error al cargar los datos del paciente.';
      },
    });
  }

  loadMedicamentos(): void {
    this.stockService.getListaMedicamentos().subscribe({
      next: (data: any[]) => {
        this.listaMedicamentos = data
          .filter(
            (item) =>
              item.tipoActividad?.name === 'Medicamento' &&
              item.estado === 'Activo' &&
              !this.inventario.some(
                (inv) => inv.nombre === (item.nombre || item.name)
              )
          )
          .map((item) => ({
            ...item,
            name: item.nombre || item.name,
          }));

        // Mostrar mensaje si no hay medicamentos disponibles
        if (this.listaMedicamentos.length === 0) {
          this.medicationMessage =
            'No hay más medicamentos activos para agregar!';
          this.showMedicationWarning = true;
        } else {
          this.showMedicationWarning = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar medicamentos:', err);
        this.listaMedicamentos = [];
        this.medicationMessage = 'Error al cargar los medicamentos.';
        this.showMedicationWarning = true;
      },
    });
  }

  loadInventario(id: number) {
    this.insumoService.getInventarioCompletoPorPaciente(id).subscribe({
      next: (data: any[]) => {
        this.inventario = data.map(item => ({
          idInsumo: item.id,
          nombre: item.nombre,
          cantidad: item.cantidadTotal,
          usado: item.cantidadUsada,
          disponible: item.cantidadDisponible
        }));
        this.isLoading = false;
        this.loadMedicamentos();
      },
      error: (err) => {
        console.error('Error al cargar inventario:', err);
        this.isLoading = false;
        this.medicationMessage = 'Error al cargar el inventario. Intente de nuevo.';
        this.showMedicationWarning = true;
      },
    });
  }


  isLowStock(item: any): boolean {
    return item.cantidad - item.usado <= item.cantidad * 0.3;
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentMedication = {
      id: null,
      nombre: '',
      dosis: '',
      frecuencia: '',
      cantidad: 1,
      fechaInicio: '',
      fechaFin: '',
      diasTratamiento: 0,
    };
    this.currentIndex = -1;
    this.showAddModal = true;
  }

  openEditModal(med: any, index: number): void {
    this.isEditing = true;
    this.currentMedication = { ...med };
    this.currentIndex = index;
    this.showEditModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
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

  onMedicamentoChange(medicationId: number): void {
    const selectedMed = this.listaMedicamentos.find(med => med.id === medicationId);
    if (selectedMed) {
      this.currentMedication.nombre = selectedMed.name;
    } else {
      this.currentMedication.nombre = '';
    }
  }

  saveMedication(): void {

     if (!this.currentMedication.id) {
      this.medicationMessage = 'Por favor, seleccione un medicamento.';
      this.showMedicationWarning = true;
      return;
    }
    if (!this.currentMedication.cantidad || this.currentMedication.cantidad < 1) {
      this.medicationMessage = 'La cantidad debe ser al menos 1.';
      this.showMedicationWarning = true;
      return;
    }

    const medicationData = {
      pacienteId: this.idPaciente,
      actividadId: this.currentMedication.id,
      cantidad: this.currentMedication.cantidad,
    };

    this.isLoading = true;
    this.insumoService.addMedicamentoPorPaciente(medicationData).subscribe({
      next: (newMedication) => {
        console.log('Medicamento agregado:', newMedication);
        this.closeAddModal();
        this.loadInventario(this.idPaciente);
        this.medicationMessage = 'Medicamento agregado correctamente.';
        this.showMedicationWarning = true;
      },
      error: (err) => {
        console.error('Error al agregar medicamento:', err);
        this.isLoading = false;
        this.medicationMessage = err.error || 'Error al agregar el medicamento. Intente de nuevo.';
        this.showMedicationWarning = true;
      },
    });
  }

  updateMedication(): void {
    if (!this.currentMedication.idInsumo) {
      alert('No se encontró el ID del insumo para actualizar');
      return;
    }

    this.isLoading = true;

    this.insumoService.updateCantidadMedicamento(
      this.currentMedication.idInsumo,
      this.currentMedication.cantidad
    ).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadInventario(this.idPaciente);
        this.medicationMessage = 'Cantidad actualizada correctamente.';
        this.showMedicationWarning = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al actualizar medicamento:', err);
        this.isLoading = false;
        this.medicationMessage = 'Error al actualizar la cantidad.';
        this.showMedicationWarning = true;
      }
    });
  }

  addMedication() {
    this.openAddModal();
  }
}
