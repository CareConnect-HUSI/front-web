import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Visit {
  id: number;
  patientId: number;
  patientName: string;
  nurseId: number;
  procedure: string;
  startTime: string;
  duration: number;
  date: Date;
  frequency?: number;  // El ? indica que es opcional
  days?: number;       // También agregué days por consistencia
  isEmergency?: boolean;
}

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css'],
})

export class CronogramaComponent implements OnInit {

  editMode: boolean = false;
  currentDate: Date = new Date();
  timeSlots: Date[] = [];

  // Datos quemados
  morningNurses = [
    { id: 1, name: 'JOHAN POLANCO', shift: 'morning' },
    { id: 2, name: 'JENNY ORTIGOZA', shift: 'morning' }
  ];
  
  afternoonNurses = [
    { id: 3, name: 'JUDY FORERO', shift: 'afternoon' },
    { id: 4, name: 'MONICA QUIÑONEZ', shift: 'afternoon' },
    { id: 5, name: 'PABLO CHAPARRO', shift: 'afternoon' }
  ];
  
  nightNurses = [
    { id: 6, name: 'WALTHER HERNANDEZ', shift: 'night' },
    { id: 7, name: 'YESSENIA HOYOS', shift: 'night' },
    { id: 8, name: 'ANGIE ESCANDON', shift: 'night' }
  ];
  
  allNurses = [...this.morningNurses, ...this.afternoonNurses, ...this.nightNurses];
  
  patients = [
    { id: 1, name: 'BLANCA VILLAMIL', document: '12345678', address: 'ANTONIO NARIÑO' },
    { id: 2, name: 'NEBER SOFIA VELANDIA', document: '87654321', address: 'BRAVO PAEZ' },
    { id: 3, name: 'GRACIELA RUBIANO', document: '56781234', address: 'RAFAEL URIBE' },
    // ... agregar más pacientes hasta 30
  ];
  
  visits = [
    { id: 1, patientId: 1, patientName: 'BLANCA VILLAMIL', nurseId: 3, procedure: 'CADA 12', 
      startTime: '13:00', duration: 30, date: new Date() },
    { id: 2, patientId: 2, patientName: 'NEBER SOFIA VELANDIA', nurseId: 3, procedure: 'CADA 6', 
      startTime: '15:00', duration: 45, date: new Date() },
    { id: 3, patientId: 3, patientName: 'GRACIELA RUBIANO', nurseId: 3, procedure: 'CADA 6 HR - CADA 12 HR', 
      startTime: '16:00', duration: 60, date: new Date() },
    // ... agregar más visitas según sea necesario
  ];
  
  // Variables para modales
  showEmergencyModal: boolean = false;
  emergencyVisit: any = {
    patientId: null,
    procedure: '',
    time: '',
    duration: '30',
    nurseId: null
  };
  
  showNewPatientModal: boolean = false;
  newPatient: any = {
    name: '',
    document: '',
    address: '',
    procedure: '',
    frequency: '12',
    startTime: '',
    duration: '30',
    days: 1
  };
  
  draggedVisit: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateTimeSlots();
    this.initializeVisits();
  }
  
  generateTimeSlots() {
    this.timeSlots = [];
    const startDate = new Date(this.currentDate);
    startDate.setHours(7, 0, 0, 0); // Comienza a las 7:00 AM
    
    for (let i = 0; i < 96; i++) { // 24 horas * 4 (15 min intervalos)
      const newTime = new Date(startDate);
      newTime.setMinutes(newTime.getMinutes() + (i * 15));
      this.timeSlots.push(newTime);
    }
  }
  
  initializeVisits() {
    // Aquí podrías cargar las visitas desde un servicio
    
  }
  setEditMode(mode: boolean) {
    this.editMode = mode;
  }
  
  changeDate(days: number) {
    this.currentDate = new Date(this.currentDate);
    this.currentDate.setDate(this.currentDate.getDate() + days);
    this.generateTimeSlots();
    // Aquí deberías recargar las visitas para la nueva fecha
  }
  
  // Funciones para determinar turnos
  isMorningShift(time: Date): boolean {
    const hours = time.getHours();
    return hours >= 7 && hours < 13;
  }
  
  isAfternoonShift(time: Date): boolean {
    const hours = time.getHours();
    return hours >= 13 && hours < 19;
  }
  
  isNightShift(time: Date): boolean {
    const hours = time.getHours();
    return hours >= 19 || hours < 7;
  }
  
  isNurseInShift(nurse: any, time: Date): boolean {
    if (nurse.shift === 'morning') return this.isMorningShift(time);
    if (nurse.shift === 'afternoon') return this.isAfternoonShift(time);
    if (nurse.shift === 'night') return this.isNightShift(time);
    return false;
  }
  
  getShiftName(shift: string): string {
    switch(shift) {
      case 'morning': return 'Mañana';
      case 'afternoon': return 'Tarde';
      case 'night': return 'Noche';
      default: return '';
    }
  }
  
  // Funciones para manejar las celdas y visitas
  isCellOccupied(nurse: any, time: Date): boolean {
    return this.getVisitInCell(nurse, time) !== null;
  }
  
  getVisitInCell(nurse: any, time: Date): any {
    const timeStr = this.formatTime(time);
    
    for (const visit of this.visits) {
      if (visit.nurseId === nurse.id && visit.date.toDateString() === this.currentDate.toDateString()) {
        
        if (visit.startTime === timeStr) {
          return visit;
        }
      }
    }
    return null;
  }
  
  getVisitWidth(visit: any): number {
    return Math.max(100, (visit.duration / 15) * 100);
  }
  
  getVisitColor(visit: any): string {
    // Puedes personalizar los colores según el tipo de procedimiento
    const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac'];
    return colors[visit.patientId % colors.length];
  }
  
  // Funciones para arrastrar y soltar
  allowDrop(event: DragEvent) {
    if (this.editMode) {
      event.preventDefault();
    }
  }
  
  drag(event: DragEvent, visit: any) {
    if (this.editMode) {
      this.draggedVisit = visit;
      event.dataTransfer?.setData('text/plain', visit.id.toString());
    }
  }
  
  drop(event: DragEvent, nurse: any, time: Date) {
    if (!this.editMode || !this.draggedVisit) return;
    
    event.preventDefault();
    const timeStr = this.formatTime(time);
    
    // Validar que no se pueda mover más de 1 hora antes o después
    const originalTime = new Date(this.draggedVisit.date);
    originalTime.setHours(parseInt(this.draggedVisit.startTime.split(':')[0]));
    originalTime.setMinutes(parseInt(this.draggedVisit.startTime.split(':')[1]));
    
    const newTime = new Date(time);
    const timeDiff = Math.abs(newTime.getTime() - originalTime.getTime()) / (1000 * 60); // Diferencia en minutos
    
    if (timeDiff > 60) {
      alert('Solo puedes mover la visita hasta 1 hora antes o después de su horario original');
      return;
    }
    
    // Validar que la enfermera esté en turno
    if (!this.isNurseInShift(nurse, time)) {
      alert('No puedes asignar la visita a una enfermera que no está en turno a esa hora');
      return;
    }
    
    // Validar que no haya superposición
    const duration = this.draggedVisit.duration;
    const endTime = this.addMinutesToTime(timeStr, duration);
    
    for (let i = 0; i < this.visits.length; i++) {
      if (this.visits[i].nurseId === nurse.id && 
          this.visits[i].date.toDateString() === this.currentDate.toDateString() &&
          this.visits[i].id !== this.draggedVisit.id) {
        
        const existingStart = this.visits[i].startTime;
        const existingEnd = this.addMinutesToTime(this.visits[i].startTime, this.visits[i].duration);
        
        if (this.isTimeOverlap(timeStr, endTime, existingStart, existingEnd)) {
          alert('No puedes asignar dos visitas a la misma enfermera en el mismo horario');
          return;
        }
      }
    }
    
    // Actualizar la visita
    this.draggedVisit.nurseId = nurse.id;
    this.draggedVisit.startTime = timeStr;
    this.draggedVisit.date = new Date(this.currentDate);
    
    // Resetear la visita arrastrada
    this.draggedVisit = null;
  }
  
  cellClicked(nurse: any, time: Date) {
    if (!this.editMode) return;
    
    const visit = this.getVisitInCell(nurse, time);
    if (visit) {
      if (confirm(`¿Deseas eliminar la visita de ${visit.patientName} a las ${visit.startTime}?`)) {
        this.visits = this.visits.filter(v => v.id !== visit.id);
      }
    }
  }
  
  // Funciones para manejar modales
  openEmergencyModal() {
    this.emergencyVisit = {
      patientId: null,
      procedure: '',
      time: '',
      duration: '30',
      nurseId: null
    };
    this.showEmergencyModal = true;
  }
  
  closeEmergencyModal() {
    this.showEmergencyModal = false;
  }
  
  addEmergencyVisit() {
    const patient = this.patients.find(p => p.id === this.emergencyVisit.patientId);
    if (!patient) return;
    
    const newVisit = {
      id: Math.max(...this.visits.map(v => v.id)) + 1,
      patientId: patient.id,
      patientName: patient.name,
      nurseId: this.emergencyVisit.nurseId,
      procedure: this.emergencyVisit.procedure,
      startTime: this.emergencyVisit.time,
      duration: parseInt(this.emergencyVisit.duration),
      date: new Date(this.currentDate),
      isEmergency: true
    };
    
    this.visits.push(newVisit);
    this.closeEmergencyModal();
  }
  
  openNewPatientModal() {
    this.newPatient = {
      name: '',
      document: '',
      address: '',
      procedure: '',
      frequency: '12',
      startTime: '',
      duration: '30',
      days: 1
    };
    this.showNewPatientModal = true;
  }
  
  closeNewPatientModal() {
    this.showNewPatientModal = false;
  }
  isVisitStart(nurse: any, time: Date): boolean {
    const visit = this.getVisitInCell(nurse, time);
    if (!visit) return false;
    
    const timeStr = this.formatTime(time);
    return visit.startTime === timeStr;
  }
  
  addNewPatient() {
    const availableNurse = this.findAvailableNurse(this.newPatient.startTime, parseInt(this.newPatient.duration, 10));
    
    if (!availableNurse) {
      alert('No hay enfermeras disponibles en este horario');
      return;
    }
  
    // Agregar nuevo paciente
    const newPatientId = Math.max(0, ...this.patients.map(p => p.id)) + 1;
    this.patients.push({
      id: newPatientId,
      name: this.newPatient.name,
      document: this.newPatient.document,
      address: this.newPatient.address
    });
    
    // Crear la nueva visita con tipo definido
  const newVisit: Visit = {
    id: Math.max(0, ...this.visits.map(v => v.id)) + 1,
    patientId: newPatientId,
    patientName: this.newPatient.name,
    nurseId: availableNurse,
    procedure: this.newPatient.procedure,
    startTime: this.newPatient.startTime,
    duration: parseInt(this.newPatient.duration, 10),
    date: new Date(this.currentDate),
    frequency: parseInt(this.newPatient.frequency, 10),
    days: this.newPatient.days
  };
  
  this.visits.push(newVisit);
  this.closeNewPatientModal();
  alert('Paciente registrado y visita agendada exitosamente');
  }
  
  findAvailableNurse(startTime: string, duration: number): number{
    // Implementar lógica para encontrar enfermera disponible
    // Por ahora devuelve la primera enfermera del turno correspondiente
    const hours = parseInt(startTime.split(':')[0]);
    
    if (hours >= 7 && hours < 13) {
      return this.morningNurses[0].id;
    } else if (hours >= 13 && hours < 19) {
      return this.afternoonNurses[0].id;
    } else {
      return this.nightNurses[0].id;
    }
  }
  
  // Funciones de utilidad
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  addMinutesToTime(timeStr: string, minutes: number): string {
    const [hours, mins] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins, 0, 0);
    date.setMinutes(date.getMinutes() + minutes);
    
    return this.formatTime(date);
  }
  
  isTimeBetween(time: string, start: string, end: string): boolean {
    const [h, m] = time.split(':').map(Number);
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    const timeMinutes = h * 60 + m;
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
  }
  
  isTimeOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const [s1h, s1m] = start1.split(':').map(Number);
    const [e1h, e1m] = end1.split(':').map(Number);
    const [s2h, s2m] = start2.split(':').map(Number);
    const [e2h, e2m] = end2.split(':').map(Number);
    
    const s1 = s1h * 60 + s1m;
    const e1 = e1h * 60 + e1m;
    const s2 = s2h * 60 + s2m;
    const e2 = e2h * 60 + e2m;
    
    return s1 < e2 && e1 > s2;
  }
  
}
