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
  openEditModal(med: any, index: number) {
    this.currentMedication = {...med};
    this.currentIndex = index;
    this.extensionDays = 0;
    this.showEditModal = true;
  }
 

  closeEditModal() {
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