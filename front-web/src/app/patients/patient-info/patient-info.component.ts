import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent {
  treatment = [
    { nombre: 'Paracetamol', cantidad: '500mg', dias: 5, posologia: 'Cada 8 horas' },
    { nombre: 'Ibuprofeno', cantidad: '200mg', dias: 7, posologia: 'Cada 12 horas' }
  ];

  editTreatment() {
    alert('Funcionalidad para cambiar el tratamiento');
  }

  viewTreatment() {
    alert('Funcionalidad para ver el tratamiento');
  }
}
