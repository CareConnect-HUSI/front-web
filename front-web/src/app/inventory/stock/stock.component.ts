import { Component} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent  {
  documentoPaciente: string | null = '';
  nombrePaciente: string = '';
  isEditing: boolean = false;
  listaMedicamentos = [
    { nombre: 'Paracetamol' },
    { nombre: 'Ibuprofeno' },
    { nombre: 'Amoxicilina' },
    { nombre: 'Metformina' },
    { nombre: 'Omeprazol' }
  ];
  // Inventario con datos quemados
  inventario: any[] = [
    {
      nombre: 'Paracetamol',
      dosis: '500 mg',
      via: 'Oral',
      frecuencia: 'Cada 8h',
      cantidad: 30,
      usado: 12,
      calendario: [
        { M: true, T: false, N: true },   // Lunes
        { M: true, T: true, N: false },   // Martes
        { M: false, T: true, N: true },   // Miércoles
        { M: true, T: false, N: false },  // Jueves
        { M: false, T: true, N: true },   // Viernes
        { M: true, T: false, N: false },  // Sábado
        { M: false, T: false, N: true }   // Domingo
      ]
    },
    {
      nombre: 'Amoxicilina',
      dosis: '250 mg',
      via: 'Oral',
      frecuencia: 'Cada 12h',
      cantidad: 20,
      usado: 8,
      calendario: [
        { M: true, T: false, N: true },
        { M: false, T: true, N: false },
        { M: true, T: false, N: true },
        { M: false, T: true, N: false },
        { M: true, T: false, N: true },
        { M: false, T: false, N: false },
        { M: true, T: false, N: false }
      ]
    },
    {
      nombre: 'Omeprazol',
      dosis: '20 mg',
      via: 'Oral',
      frecuencia: 'Cada 24h',
      cantidad: 15,
      usado: 5,
      calendario: [
        { M: true, T: false, N: false },
        { M: false, T: true, N: false },
        { M: false, T: false, N: true },
        { M: true, T: false, N: false },
        { M: false, T: true, N: false },
        { M: false, T: false, N: true },
        { M: true, T: false, N: false }
      ]
    }
  ];
  // Variables para modales
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showMedicationWarning: boolean = false;
  medicationMessage: string = '';
  
  currentMedication: any = {};
  currentIndex: number = -1;
  extensionDays: number = 0;
  medicationToDelete: number = -1;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  logAdministration(item: any, day: any, shift: string) {
    if (!day[shift]) {
      day[shift] = true;
      item.usado++;
      
      // Aquí podrías agregar lógica para guardar en el backend
    }
  }

  isLowStock(item: any): boolean {
    return (item.cantidad - item.usado) <= (item.cantidad * 0.3); // 20% o menos
  }

  // Abrir modal de edición
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
        diasTratamiento: 0
      };
    }
    this.showEditModal = true;
  }
  
  closeEditModal(): void {
    this.showEditModal = false;
  }

  updateMedication() {
    if (this.extensionDays > 0) {
      this.currentMedication.diasTratamiento += this.extensionDays;
      this.medicationMessage = `Se extendió el tratamiento de ${this.currentMedication.nombre} por ${this.extensionDays} días. `;
      this.medicationMessage += `Debe enviar ${this.calculateAdditionalDoses(this.currentMedication)} dosis adicionales antes de ${this.getDeliveryDate()} para que el paciente las tenga disponibles.`;
      this.showMedicationWarning = true;
    }
    
    this.inventario[this.currentIndex] = {...this.currentMedication};
    this.closeEditModal();
  }

  updateTotal(item: any): void {
    if (item.cantidad < 1) {
      alert('La cantidad debe ser al menos 1.');
      item.cantidad = 1; // Restablecer al mínimo permitido
    }
    console.log(`Cantidad actualizada para el medicamento ${item.nombre}: ${item.cantidad}`);
  }

  saveMedication(): void {
    if (this.isEditing) {
      // Actualizar el medicamento existente
      this.inventario[this.currentIndex] = { ...this.currentMedication };
      console.log('Medicamento actualizado:', this.currentMedication);
    } else {
      // Agregar un nuevo medicamento
      this.inventario.push({ ...this.currentMedication });
      console.log('Nuevo medicamento agregado:', this.currentMedication);
    }
    this.closeEditModal();
  }

  calculateDays(medication: any): void {
    const fechaInicio = new Date(medication.fechaInicio);
    const fechaFin = new Date(medication.fechaFin);
  
    if (fechaInicio && fechaFin && fechaInicio <= fechaFin) {
      const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      medication.diasTratamiento = dias;
  
      // Limpiar el calendario antes de marcar los días
      medication.calendario = Array(7).fill({ M: false, T: false, N: false });
  
      // Obtener la cantidad de dosis por día según la frecuencia
      const dosisPorDia = this.getDosesPerDay(medication.frecuencia);
  
      // Marcar los días en el cronograma
      for (let i = 0; i < dias && i < 7; i++) {
        const daySchedule = { M: false, T: false, N: false };
  
        if (dosisPorDia >= 1) daySchedule.M = true; // Mañana
        if (dosisPorDia >= 2) daySchedule.T = true; // Tarde
        if (dosisPorDia >= 3) daySchedule.N = true; // Noche
  
        medication.calendario[i] = daySchedule;
      }
  
      console.log(`Días calculados para el medicamento ${medication.nombre}: ${dias}`);
      console.log(`Calendario generado:`, medication.calendario);
    } else {
      alert('La fecha de fin debe ser posterior a la fecha de inicio.');
      medication.fechaFin = null; // Restablecer si las fechas son inválidas
    }
  }

  calculateAdditionalDoses(med: any): number {
    const dosesPerDay = this.getDosesPerDay(med.frecuencia);
    return dosesPerDay * this.extensionDays;
  }

  getDosesPerDay(frecuencia: string): number {
    switch(frecuencia) {
      case 'Cada 6h': return 4;
      case 'Cada 8h': return 3;
      case 'Cada 12h': return 2;
      case 'Cada 24h': return 1;
      default: return 1;
    }
  }

  getDeliveryDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 días para entrega
    return date.toLocaleDateString();
  }
  
  // Funciones para eliminar medicamento
  confirmDelete(index: number) {
    this.medicationToDelete = index;
    this.showDeleteModal = true;
  }

  deleteMedication() {
    const deletedMed = this.inventario[this.medicationToDelete].nombre;
    this.inventario.splice(this.medicationToDelete, 1);
    this.showDeleteModal = false;
    
    this.medicationMessage = `Se eliminó el medicamento ${deletedMed} del tratamiento.`;
    this.showMedicationWarning = true;
  }

  // Agregar nuevo medicamento
  addMedication() {
    const newId = Math.max(...this.inventario.map(m => m.id)) + 1;
    const newMed = {
      id: newId,
      nombre: 'Nuevo Medicamento',
      dosis: '100 mg',
      via: 'Oral',
      frecuencia: 'Cada 12h',
      horaInicio: '08:00',
      cantidad: 10,
      usado: 0,
      diasTratamiento: 7,
      calendario: Array(7).fill({ M: false, T: false, N: false })
    };
    
    this.inventario.push(newMed);
    this.openEditModal(newMed, this.inventario.length - 1);
  }

  saveChanges() {
    // Lógica para guardar todos los cambios
    alert('Cambios guardados exitosamente');
  }

}