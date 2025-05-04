import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {
  isLoading: boolean = false; // Nueva variable para el estado de carga
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
    private patientService: PatientService,
    private stockService: StockService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.documentoPaciente = this.route.snapshot.paramMap.get('documento');
    if (this.documentoPaciente) {
      this.loadInventario(this.documentoPaciente);
    }
    else {
      this.isLoading = false;
    }

    this.loadMedicamentos();
  }

  loadMedicamentos(): void {
    this.stockService.getListaMedicamentos().subscribe({
      next: (data: any[]) => {
        // Filtrar solo medicamentos activos
        this.listaMedicamentos = data.filter(
          (item) => item.tipoActividad?.id === 1 && item.estado === 'Activo'
        );
      },
      error: (err) => {
        console.error('Error al cargar medicamentos:', err);
        this.listaMedicamentos = [];
      }
    });
  }
    
  

  loadInventario(documento: string) {
    this.patientService.findActividadesPorDocumento(documento).subscribe({
      next: (data: any[]) => {
        console.log('Inventario recibido:', data);
        this.nombrePaciente = data[0]?.pacienteNombre ?? '';
        this.inventario = data.map(act => ({
          nombre: act.nombreActividad,
          dosis: `${act.dosis} mg`,
          via: 'Oral',
          frecuencia: `${act.frecuencia} veces al día`,
          cantidad: act.dosis * act.diasTratamiento,
          usado: 0,
          calendario: this.generarCalendario(act.diasTratamiento, act.frecuencia)
        }));
        this.isLoading = false; // Desactivar el loading al recibir los datos
      },
      error: (err) => {
        console.error('Error al cargar inventario:', err);
        this.isLoading = false; // Desactivar el loading al recibir los datos
        this.medicationMessage = 'Error al cargar el inventario. Intente de nuevo.';

      }
    });
  }

  generarCalendario(dias: number, frecuencia: number): any[] {
    const calendario = [];
    for (let i = 0; i < 7; i++) {
      calendario.push({
        M: frecuencia >= 1,
        T: frecuencia >= 2,
        N: frecuencia >= 3
      });
    }
    return calendario;
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

  calculateDays(medication: any): void {
    const fechaInicio = new Date(medication.fechaInicio);
    const fechaFin = new Date(medication.fechaFin);

    if (fechaInicio && fechaFin && fechaInicio <= fechaFin) {
      const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      medication.diasTratamiento = dias;

      medication.calendario = Array(7).fill({ M: false, T: false, N: false });
      const dosisPorDia = this.getDosesPerDay(medication.frecuencia);

      for (let i = 0; i < dias && i < 7; i++) {
        const daySchedule = { M: false, T: false, N: false };
        if (dosisPorDia >= 1) daySchedule.M = true;
        if (dosisPorDia >= 2) daySchedule.T = true;
        if (dosisPorDia >= 3) daySchedule.N = true;
        medication.calendario[i] = daySchedule;
      }
    } else {
      alert('La fecha de fin debe ser posterior a la fecha de inicio.');
      medication.fechaFin = null;
    }
  }

  getDosesPerDay(frecuencia: string): number {
    if (frecuencia.includes('6')) return 4;
    if (frecuencia.includes('8')) return 3;
    if (frecuencia.includes('12')) return 2;
    return 1;
  }

  addMedication() {
    this.openEditModal();
  }

  confirmDelete(index: number) {
    this.inventario.splice(index, 1);
  }

  logAdministration(item: any, day: any, shift: string) {
    if (!day[shift]) {
      day[shift] = true;
      item.usado++;
    }
  }
}
