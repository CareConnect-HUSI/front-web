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

  listaTratamientos: any[] = [];
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
        console.log('Paciente cargado:', patient);
        this.nombrePaciente = patient.nombre || '';
        this.documentoPaciente = patient.numeroIdentificacion || '';

        
        if (patient.actividades) {
          this.tratamientos = patient.actividades.map((actividad: any) => {
            console.log('Actividad completa:', actividad);

            return {
              idRelacion: actividad.id,
              nombre: actividad.actividad?.nombreActividad || actividad.nombreActividad || 'Sin nombre',
              hora: actividad.hora || '',
              dosis: actividad.dosis,
              frecuencia: actividad.frecuencia,
              usado: actividad.usado || 0,
              fechaInicio: actividad.fechaInicio || '',
              fechaFin: actividad.fechaFin || '',
              diasTratamiento: actividad.diasTratamiento || 0,
              actividadId: actividad.actividad?.id || actividad.actividadId || null
            };
          });
          
          console.log('Tratamientos construidos:', this.tratamientos);


          this.isLoading = false; 
        } else {
          console.log('Tratamientos:', this.tratamientos);
          this.tratamientos = [];
          this.isLoading = false; 

        }
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
      }
    });
  }

  openEditModal(med: any, index: number): void {
    console.log('Tratamiento recibido en modal:', med);
  
    if (!med.idRelacion) {
      console.warn('Tratamiento sin idRelacion. No se puede editar.');
      this.medicationMessage = 'Este tratamiento no puede editarse porque falta el identificador de la relación.';
      this.showMedicationWarning = true;
      return;
    }
  
    this.currentIndex = index;
  
    this.stockService.getListaMedicamentos().subscribe({
      next: (data: any[]) => {
        this.listaTratamientos = data.filter(item => item.estado === 'Activo');
  
        const nombreActividad = (med.nombre || med.nombreActividad || '')
          .normalize("NFD").replace(/[\u0300-\u036f]/g, '')
          .trim().toLowerCase();
  
        const actividadEncontrada = this.listaTratamientos.find(item => {
          const nombreItem = (item.name || item.nombre || '')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, '')
            .trim().toLowerCase();
          return nombreItem === nombreActividad;
        });
  
        const actividadId = actividadEncontrada ? actividadEncontrada.id : null;
  
        if (!actividadId) {
          console.warn('No se encontró ID para la actividad:', nombreActividad);
        }
  
        this.currentMedication = {
          idRelacion: med.idRelacion,
          actividadId: actividadId,
          nombre: med.nombre || med.nombreActividad || '',
          dosis: med.dosis,
          frecuencia: med.frecuencia,
          hora: med.hora,
          fechaInicio: med.fechaInicio,
          fechaFin: med.fechaFin,
          diasTratamiento: med.diasTratamiento,
          usado: med.usado,
        };
  
        this.showEditModal = true;
      },
      error: (err) => {
        console.error('Error al cargar medicamentos:', err);
        this.listaTratamientos = [];
        this.medicationMessage = 'Error al cargar la lista de medicamentos.';
        this.showMedicationWarning = true;
      },
    });
    this.calculateDays(this.currentMedication);
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

  updateTreatment(): void {
    if (!this.currentMedication?.actividadId || !this.currentMedication?.idRelacion) {
      this.medicationMessage = 'Falta información clave del tratamiento.';
      console.error('Falta información clave del tratamiento:', this.currentMedication);
      this.showMedicationWarning = true;
      return;
    }
    
    const horaFormateada = this.currentMedication.hora?.slice(0, 5);

    
    const treatmentToUpdate = {
      id: this.currentMedication.idRelacion,
      dosis: parseInt(this.currentMedication.dosis),
      frecuencia: parseInt(this.currentMedication.frecuencia),
      hora: horaFormateada,
      fechaInicio: this.currentMedication.fechaInicio,
      fechaFin: this.currentMedication.fechaFin,
      diasTratamiento: this.currentMedication.diasTratamiento,
      actividad: {
        id: this.currentMedication.actividadId
      },
      paciente: {
        id: this.idPaciente
      }
    };
    console.log('Payload a enviar:', treatmentToUpdate);

    this.pacienteService.updateTratamiento(this.currentMedication.idRelacion, treatmentToUpdate)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.medicationMessage = 'Tratamiento actualizado correctamente.';
          this.showMedicationWarning = true;
          this.closeEditModal();
        },
        error: (err) => {
          this.isLoading = false;
          this.medicationMessage = 'Error al actualizar el tratamiento.';
          this.showMedicationWarning = true;
          console.error('Error al actualizar tratamiento:', err);
        }
      });

      const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.idPaciente = +idParam;
      this.loadPatientData(this.idPaciente);
    } else {
      this.isLoading = false;
      this.medicationMessage = 'No se proporcionó un ID de paciente.';
    }
    
  }
  

  calculateDays(medication: any): void {
    if (!medication?.fechaInicio || !medication?.fechaFin) {
      medication.diasTratamiento = 0;
      return;
    }
  
    const fechaInicio = new Date(medication.fechaInicio);
    const fechaFin = new Date(medication.fechaFin);
  
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime()) || fechaInicio > fechaFin) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio.');
      medication.fechaFin = null;
      medication.diasTratamiento = 0;
      return;
    }
  
    const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
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