import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-detalle-asignacion',
  templateUrl: './detalle-asignacion.component.html',
  styleUrls: ['./detalle-asignacion.component.css']
})
export class DetalleAsignacionComponent {
  showTimeModal = false;
  fechaVisita = new Date();

  paciente = {
    nombres: 'María José',
    apellidos: 'López',
    documento: '123456789'
  };

  registro = {
    horaIngreso: '08:30',
    horaSalida: '10:15',
    procedimientos: [
      { nombre: 'Curación', descripcion: 'Curación de herida quirúrgica', observaciones: 'Herida limpia, sin signos de infección' },
      { nombre: 'Toma de signos vitales', descripcion: 'Registro de presión arterial, temperatura y frecuencia cardíaca', observaciones: 'Presión arterial ligeramente elevada' }
    ],
    medicamentos: [
      { nombre: 'Paracetamol', dosis: '500mg', via: 'Oral', hora: '09:00', observaciones: 'Paciente toleró bien' },
      { nombre: 'Insulina', dosis: '10UI', via: 'Subcutánea', hora: '09:30', observaciones: 'Aplicada en abdomen' }
    ],
    insumos: [
      { nombre: 'Gasas estériles', cantidad: '2', descripcion: 'Para curación' },
      { nombre: 'Isodine', cantidad: '1 frasco', descripcion: 'Antiséptico para herida' },
      { nombre: 'Guantes desechables', cantidad: '1 par', descripcion: 'Protección' }
    ],
    incidentes: 'El paciente refirió mareo leve después de la aplicación de insulina. Se monitoreó por 15 minutos y los síntomas desaparecieron.'
  };

  constructor(private router: Router) {}

  calcularTiempoVisita(): string {
    const [horaIn, minIn] = this.registro.horaIngreso.split(':').map(Number);
    const [horaOut, minOut] = this.registro.horaSalida.split(':').map(Number);
    
    const totalMinIn = horaIn * 60 + minIn;
    const totalMinOut = horaOut * 60 + minOut;
    
    const diff = totalMinOut - totalMinIn;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    
    return `${hours}h ${minutes}m`;
  }

  editTime() {
    this.showTimeModal = true;
  }

  closeTimeModal() {
    this.showTimeModal = false;
  }

  updateTimes() {
    this.closeTimeModal();
  }

  editProcedures() {
    alert('Funcionalidad para editar procedimientos');
  }

  editMedications() {
    alert('Funcionalidad para editar medicamentos');
  }

  editSupplies() {
    alert('Funcionalidad para editar insumos');
  }

  editIncidents() {
    alert('Funcionalidad para editar incidentes');
  }

  saveRecord() {
    alert('Registro guardado exitosamente');
  }
  goBack() {
    this.router.navigate(['/nurses-assignment']); // O la ruta a la que quieras volver
    // Alternativa genérica que vuelve a la página anterior:
    // this.location.back();
  }
}