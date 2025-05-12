import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css'],
})
export class TreatmentsComponent implements OnInit {
  isLoading: boolean = false;
  idPaciente: number = 0;
  documentoPaciente: string | null = '';
  nombrePaciente: string = '';
  tratamientos: any[] = [];
  procedimientos: any[] = [];

  listaTratamientos: any[] = [];
  showEditModal: boolean = false;
  showAddModal: boolean = false;
  showMedicationWarning: boolean = false;
  medicationMessage: string = '';

  currentMedication: any = {};
  currentIndex: number = -1;

   duraciones: number[] = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PatientService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.idPaciente = +idParam;
      this.loadPatientData(this.idPaciente);
    } else {
      this.isLoading = false;
      this.medicationMessage = 'No se proporcionó un ID de paciente.';
    }
  }

  loadPatientData(id: number): void {
    this.isLoading = true;

    this.pacienteService.obtenerPacientePorId(id).subscribe({
      next: (patient: any) => {
        this.nombrePaciente = patient.nombre || '';
        this.documentoPaciente = patient.numeroIdentificacion || '';

        const actividades = patient.actividades || [];

        console.log('Actividad ejemplo completa:', actividades[0]);
        this.tratamientos = actividades
          .filter((a: any) => a.tipoActividadId === 1)
          .map((actividad: any) => ({
            idRelacion: actividad.id,
            nombre: actividad.nombreActividad || 'Sin nombre',
            dosis: actividad.dosis,
            frecuencia: actividad.frecuencia,
            hora: actividad.hora.substring(0, 5),
            fechaInicio: actividad.fechaInicio,
            fechaFin: actividad.fechaFin,
            diasTratamiento: actividad.diasTratamiento,
            actividadId: actividad.actividadId,
            tipoActividadId: actividad.tipoActividadId,
            duracion: actividad.duracionVisita,
          }));

          console.log('Actividad ejemplo completa:', actividades[0]);

        this.procedimientos = actividades
          .filter((a: any) => a.tipoActividadId === 2)
          .map((actividad: any) => ({
            idRelacion: actividad.id,
            nombre: actividad.nombreActividad || 'Sin nombre',
            dosis: actividad.dosis,
            frecuencia: actividad.frecuencia,
            hora: actividad.hora.substring(0, 5),
            fechaInicio: actividad.fechaInicio,
            fechaFin: actividad.fechaFin,
            diasTratamiento: actividad.diasTratamiento,
            actividadId: actividad.actividadId,
            tipoActividadId: actividad.tipoActividadId,
            duracion: actividad.duracionVisita,

          }));

        console.log('Tratamientos:', this.tratamientos);
        console.log('Procedimientos:', this.procedimientos);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del paciente:', err);
        this.nombrePaciente = '';
        this.documentoPaciente = '';
        this.medicationMessage = 'Error al cargar los datos del paciente.';
        this.isLoading = false;
      },
    });
  }

  generarCalendario(dias: number, frecuencia: number): any[] {
    const calendario = [];
    for (let i = 0; i < 7; i++) {
      calendario.push({
        M: frecuencia >= 1,
        T: frecuencia >= 2,
        N: frecuencia >= 3,
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
      hora: '',
      fechaInicio: '',
      fechaFin: '',
      diasTratamiento: 0,
      usado: 0,
      tipoActividadId: 1,
    };
    this.showAddModal = true;
    this.loadListaTratamientos();
  }

  loadListaTratamientos(): void {
    this.stockService.getListaMedicamentos().subscribe({
      next: (data: any[]) => {
        this.listaTratamientos = data.filter(
          (item) => item.estado === 'Activo'
        );
        console.log('Lista de tratamientos activos:', this.listaTratamientos);
      },
      error: (err) => {
        console.error('Error al cargar medicamentos:', err);
        this.listaTratamientos = [];
        this.medicationMessage = 'Error al cargar la lista de medicamentos.';
        this.showMedicationWarning = true;
      },
    });
  }

  openEditModal(item: any, index: number): void {
    this.currentIndex = index;

    const isTratamiento = item.tipoActividadId === 1;
    const isProcedimiento = item.tipoActividadId === 2;

    if (!item.idRelacion) {
      this.medicationMessage = 'Falta el identificador para editar.';
      this.showMedicationWarning = true;
      return;
    }

    this.currentMedication = {
      idRelacion: item.idRelacion,
      actividadId: item.actividadId,
      nombre: item.nombre,
      dosis: item.dosis,
      frecuencia: item.frecuencia,
      hora: item.hora,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      diasTratamiento: item.diasTratamiento,
      tipoActividadId: item.tipoActividadId,
      duracion: item.duracion,
    };

    if (isTratamiento) {
      this.loadListaTratamientos();
    }

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
    const selectedActividad = this.listaTratamientos.find(
      (item) => item.name === this.currentMedication.nombre
    );

    if (!selectedActividad) {
      this.medicationMessage = 'No se encontró la actividad seleccionada.';
      this.showMedicationWarning = true;
      return;
    }

    const payload = {
      dosis: parseInt(this.currentMedication.dosis),
      frecuencia: parseInt(this.currentMedication.frecuencia),
      hora: this.currentMedication.hora?.slice(0, 5),
      fechaInicio: this.currentMedication.fechaInicio,
      fechaFin: this.currentMedication.fechaFin,
      diasTratamiento: this.currentMedication.diasTratamiento,
      actividad: { id: selectedActividad.id },
      paciente: { id: this.idPaciente },
      duracion: this.currentMedication.duracion,
    };

    console.log('Payload para registrar tratamiento:', payload);

    this.pacienteService.registrarTratamiento(payload).subscribe({
      next: () => {
        this.medicationMessage = 'Tratamiento agregado correctamente.';
        this.showMedicationWarning = true;
        this.loadPatientData(this.idPaciente);
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Error al registrar tratamiento:', err);
        this.medicationMessage = 'Error al agregar el tratamiento.';
        this.showMedicationWarning = true;
      },
    });
  }

  updateTreatment(): void {
    if (
      !this.currentMedication?.actividadId ||
      !this.currentMedication?.idRelacion
    ) {
      this.medicationMessage =
        'Falta información del tratamiento o procedimiento.';
      this.showMedicationWarning = true;
      return;
    }

    const basePayload: any = {
      id: this.currentMedication.idRelacion,
      hora: this.currentMedication.hora,
      fechaInicio: this.currentMedication.fechaInicio,
      actividad: { id: this.currentMedication.actividadId },
      paciente: { id: this.idPaciente },
      duracionVisita: this.currentMedication.duracion,
    };

    if (this.currentMedication.tipoActividadId === 1) {
      basePayload.dosis = parseInt(this.currentMedication.dosis);
      basePayload.frecuencia = parseInt(this.currentMedication.frecuencia);
      basePayload.fechaFin = this.currentMedication.fechaFin;
      basePayload.diasTratamiento = this.currentMedication.diasTratamiento;
      basePayload.duracionVisita = this.currentMedication.duracion;
    }

    console.log('Payload para actualizar tratamiento:', basePayload);
    this.pacienteService
      .updateTratamiento(this.currentMedication.idRelacion, basePayload)
      .subscribe({
        next: () => {
          this.medicationMessage = 'Actualizado correctamente.';
          this.showMedicationWarning = true;
          this.loadPatientData(this.idPaciente);
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.medicationMessage = 'Error al actualizar.';
          this.showMedicationWarning = true;
        },
      });
  }

  calculateDays(medication: any): void {
    if (!medication?.fechaInicio || !medication?.fechaFin) {
      medication.diasTratamiento = 0;
      return;
    }

    const fechaInicio = new Date(medication.fechaInicio);
    const fechaFin = new Date(medication.fechaFin);

    if (
      isNaN(fechaInicio.getTime()) ||
      isNaN(fechaFin.getTime()) ||
      fechaInicio > fechaFin
    ) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio.');
      medication.fechaFin = null;
      medication.diasTratamiento = 0;
      return;
    }

    const dias =
      Math.ceil(
        (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
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
}
