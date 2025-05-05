import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css']
})
export class TreatmentsComponent implements OnInit {
  isLoading: boolean = false;
  idPaciente: number = 0;
  documentoPaciente: string | null = '';
  nombrePaciente: string = '';
  tratamientos: any[] = [];

  listaMedicamentos: any[] = [];
  showEditModal: boolean = false;
  showAddModal: boolean = false;
  showMedicationWarning: boolean = false;
  medicationMessage: string = '';

  currentMedication: any = {};
  currentIndex: number = -1;

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PatientService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.idPaciente = +idParam;
      this.loadPatientData(this.idPaciente);
      // this.loadInventario(this.idPaciente);
      // this.loadTratamientos(this.idPaciente);
    } else {
      this.isLoading = false;
      this.medicationMessage = 'No se proporcionó un ID de paciente.';
    }

    
  }

  loadPatientData(id: number): void {
    this.pacienteService.obtenerPacientePorId(id).subscribe({
      
      next: (patient: any) => {
        console.log('Paciente cargado:', patient);
        this.nombrePaciente = patient.nombre || '';
        this.documentoPaciente = patient.numeroIdentificacion || '';

        if (patient.actividades) {
          this.tratamientos = patient.actividades.map((actividad: any) => ({
            nombre: actividad.nombreActividad,
            dosis: actividad.dosis ? `${actividad.dosis} mg` : '',
            hora: actividad.hora || '',
            frecuencia: actividad.frecuencia || '',
            cantidad: actividad.cantidad || 1,
            usado: actividad.usado || 0,
            fechaInicio: actividad.fechaInicio || '',
            fechaFin: actividad.fechaFin || '',
            diasTratamiento: actividad.diasTratamiento || 0,
            // calendario: actividad.calendario || this.generarCalendario(7, this.getDosesPerDay(actividad.frecuencia || 'Cada 24h'))
          }));
          console.log('Tratamientos:', this.tratamientos);
        } else {
          console.log('Tratamientos:', this.tratamientos);
          this.tratamientos = [];
        }
      },

      error: (err) => {
        console.error('Error al cargar datos del paciente:', err);
        this.nombrePaciente = '';
        this.documentoPaciente = '';
        this.medicationMessage = 'Error al cargar los datos del paciente.';
      },
    });
    this.isLoading = false; //Quitarlo
  }


  loadTratamientos(id: number): void {
    // this.pacienteService.getTratamientosPorId(id).subscribe({
    //   next: (data: any[]) => {
    //     this.tratamientos = data; // Sin filtro, asigna todos los datos recibidos
    //     console.log('Tratamientos:', data);
    //     console.log('Medicamentos:', this.tratamientos);
    //   },
    //   error: (err) => {
    //     console.log('Medicamentos error:', this.tratamientos);
    //     console.error('Error al cargar medicamentos:', err);
    //     this.listaMedicamentos = [];
    //     this.medicationMessage = 'Error al cargar la lista de medicamentos.';
    //     this.showMedicationWarning = true;
    //   }
    // });
  }

  loadMedicamentos(): void {
    // this.stockService.getListaMedicamentos().subscribe({
    //   next: (data: any[]) => {
    //     this.listaMedicamentos = data.filter(
    //       (item) => item.tipoActividad?.id === 1 && item.estado === 'Activo'
    //     );
    //   },
    //   error: (err) => {
    //     console.error('Error al cargar medicamentos:', err);
    //     this.listaMedicamentos = [];
    //     this.medicationMessage = 'Error al cargar la lista de medicamentos.';
    //     this.showMedicationWarning = true;
    //   }
    // });
  }

  loadInventario(documento: string): void {
    // this.stockService.getTratamientosPorPaciente(documento).subscribe({
    //   next: (tratamientos: any[]) => {
    //     this.inventario = tratamientos.map((tratamiento) => ({
    //       nombre: tratamiento.nombre,
    //       dosis: tratamiento.dosis,
    //       frecuencia: tratamiento.frecuencia,
    //       cantidad: tratamiento.cantidad,
    //       usado: tratamiento.usado || 0,
    //       fechaInicio: tratamiento.fechaInicio,
    //       fechaFin: tratamiento.fechaFin,
    //       diasTratamiento: tratamiento.diasTratamiento || 0,
    //       calendario: tratamiento.calendario || this.generarCalendario(7, this.getDosesPerDay(tratamiento.frecuencia))
    //     }));
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error al cargar inventario:', err);
    //     this.inventario = [];
    //     this.medicationMessage = 'Error al cargar el inventario de tratamientos.';
    //     this.showMedicationWarning = true;
    //     this.isLoading = false;
    //   }
    // });
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

  addMedication(): void {
    this.currentMedication = {
      nombre: '',
      dosis: '',
      frecuencia: '',
      cantidad: 1,
      fechaInicio: '',
      fechaFin: '',
      diasTratamiento: 0,
      usado: 0,
      calendario: this.generarCalendario(7, 0)
    };
    this.showAddModal = true;
  }

  openEditModal(med: any, index: number): void {
    this.currentMedication = { ...med };
    this.currentIndex = index;
    this.showEditModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.currentMedication = null;
    this.currentIndex = -1;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentMedication = null;
    this.currentIndex = -1;
  }

  saveMedication(): void {
    // if (this.showEditModal && this.currentIndex >= 0) {
    //   // Editar tratamiento existente
    //   this.inventario[this.currentIndex] = { ...this.currentMedication };
    //   this.stockService.actualizarTratamiento(this.documentoPaciente!, this.currentMedication).subscribe({
    //     next: () => {
    //       this.medicationMessage = 'Tratamiento actualizado correctamente.';
    //       this.showMedicationWarning = true;
    //     },
    //     error: (err) => {
    //       console.error('Error al actualizar tratamiento:', err);
    //       this.medicationMessage = 'Error al actualizar el tratamiento.';
    //       this.showMedicationWarning = true;
    //     }
    //   });
    // } else if (this.showAddModal) {
    //   // Agregar nuevo tratamiento
    //   this.inventario.push({ ...this.currentMedication });
    //   this.stockService.agregarTratamiento(this.documentoPaciente!, this.currentMedication).subscribe({
    //     next: () => {
    //       this.medicationMessage = 'Tratamiento agregado correctamente.';
    //       this.showMedicationWarning = true;
    //     },
    //     error: (err) => {
    //       console.error('Error al agregar tratamiento:', err);
    //       this.medicationMessage = 'Error al agregar el tratamiento.';
    //       this.showMedicationWarning = true;
    //     }
    //   });
    // }
    // this.closeAddModal();
    // this.closeEditModal();
  }

  updateTotal(item: any): void {
    // if (item.cantidad < 1) {
    //   alert('La cantidad debe ser al menos 1.');
    //   item.cantidad = 1;
    // }
    // this.stockService.actualizarTratamiento(this.documentoPaciente!, item).subscribe({
    //   next: () => {
    //     console.log('Cantidad actualizada correctamente.');
    //   },
    //   error: (err) => {
    //     console.error('Error al actualizar cantidad:', err);
    //     this.medicationMessage = 'Error al actualizar la cantidad.';
    //     this.showMedicationWarning = true;
    //   }
    // });
  }

  calculateDays(medication: any): void {
    const fechaInicio = new Date(medication.fechaInicio);
    const fechaFin = new Date(medication.fechaFin);

    if (fechaInicio && fechaFin && fechaInicio <= fechaFin) {
      const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      medication.diasTratamiento = dias;

      const dosisPorDia = this.getDosesPerDay(medication.frecuencia);
      medication.calendario = Array(7).fill({ M: false, T: false, N: false });

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

  confirmDelete(index: number): void {
    // const tratamiento = this.inventario[index];
    // this.stockService.eliminarTratamiento(this.documentoPaciente!, tratamiento).subscribe({
    //   next: () => {
    //     this.inventario.splice(index, 1);
    //     this.medicationMessage = 'Tratamiento eliminado correctamente.';
    //     this.showMedicationWarning = true;
    //   },
    //   error: (err) => {
    //     console.error('Error al eliminar tratamiento:', err);
    //     this.medicationMessage = 'Error al eliminar el tratamiento.';
    //     this.showMedicationWarning = true;
    //   }
    // });
  }

  logAdministration(item: any, day: any, shift: string): void {
    // if (!day[shift]) {
    //   day[shift] = true;
    //   item.usado++;
    //   this.stockService.actualizarTratamiento(this.documentoPaciente!, item).subscribe({
    //     next: () => {
    //       console.log('Administración registrada correctamente.');
    //     },
    //     error: (err) => {
    //       console.error('Error al registrar administración:', err);
    //       this.medicationMessage = 'Error al registrar la administración.';
    //       this.showMedicationWarning = true;
    //     }
    //   });
    // }
  }
}