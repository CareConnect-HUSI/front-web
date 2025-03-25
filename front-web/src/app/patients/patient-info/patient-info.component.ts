import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent {
  showEditModal = false;

  paciente = {
    nombres: 'María José ',
    apellidos: 'López',
    documento: '123456789',
    direccion: 'Calle 123 #45-67',
    localidad: 'Suba',
    barrio: 'El Prado',
    celular: '3001234567',
    email: 'maria@ejemplo.com',
    nombreFamiliar: 'Carlos Lopéz',
    celularFamiliar: '3109876543',
    parentesco: 'Padre'

  };

  treatment = [
    { nombre: 'Paracetamol', cantidad: '500mg', dias: 5, posologia: 'Cada 8 horas', fechaInicio: new Date() },
    { nombre: 'Ibuprofeno', cantidad: '200mg', dias: 7, posologia: 'Cada 12 horas', fechaInicio: new Date() }
  ];

  historial = [
    { tratamiento: 'Paracetamol', dias: 5, completado: true },
    { tratamiento: 'Ibuprofeno', dias: 7, completado: false }
  ];

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveChanges() {
    alert('Datos guardados correctamente');
    this.closeEditModal();
  }

  viewTreatment() {
    alert('Funcionalidad para ver el tratamiento');
  }
}
