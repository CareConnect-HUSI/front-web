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
  frequency?: number;
  days?: number;
  isEmergency?: boolean;
  isOptimizedSuggestion?: boolean;
  originalNurseId?: number;
  originalTime?: string;
}

interface Patient {
  id: number;
  name: string;
  lastName?: string;
  address: string;
  phone?: string;
  email?: string;
  document: string;
  documentType?: string;
  relativeName?: string;
  relativeRelationship?: string;
  relativePhone?: string;
  neighborhood?: string;
  complex?: string;
  latitude?: number;
  longitude?: number;
  priority?: string;
}

interface Nurse {
  id: number;
  name: string;
  lastName?: string;
  phone?: string;
  address?: string;
  complex?: string;
  neighborhood?: string;
  email?: string;
  password?: string;
  shiftId?: number;
  role?: string;
  latitude?: number;
  longitude?: number;
  shift: string; // 'morning', 'afternoon', 'night'
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
  nextDay: Date = new Date();

  // Toast notifications
  showToast: boolean = false;
  toastTitle: string = '';
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastTimeout: any;

  // Datos quemados
  morningNurses: Nurse[] = [
    { id: 1000001, name: 'JOHAN POLANCO', shift: 'morning' },
    { id: 1000002, name: 'SANDRA LOPEZ', shift: 'morning' },
    { id: 1000003, name: 'ANGELINA RAMIREZ', shift: 'morning' },
    { id: 1000004, name: 'SARA MARTINEZ', shift: 'morning' },
    { id: 1000005, name: 'SOFIA RODRIGUEZ', shift: 'morning' },
  ];
  
  afternoonNurses: Nurse[] = [
    { id: 1000050, name: 'JUDY FORERO', shift: 'afternoon' },
    { id: 1000051, name: 'MONICA QUIÑONEZ', shift: 'afternoon' },
    { id: 1000052, name: 'PABLO CHAPARRO', shift: 'afternoon' }
  ];
  
  nightNurses: Nurse[] = [
    { id: 1000053, name: 'WALTHER HERNANDEZ', shift: 'night' },
    { id: 1000054, name: 'YESSENIA HOYOS', shift: 'night' },
    { id: 1000055, name: 'ANGIE ESCANDON', shift: 'night' }
  ];
  
  allNurses: Nurse[] = [...this.morningNurses, ...this.afternoonNurses, ...this.nightNurses];
  
  patients: Patient[] = [
    { id: 1000006, name: 'BLANCA VILLAMIL', document: '12345678', address: 'ANTONIO NARIÑO', priority: 'normal' },
    { id: 1000007, name: 'NEBER SOFIA VELANDIA', document: '87654321', address: 'BRAVO PAEZ', priority: 'high' },
    { id: 1000008, name: 'GRACIELA RUBIANO', document: '56781234', address: 'RAFAEL URIBE', priority: 'normal' },
    { id: 1000008, name: 'CARLOS MENDOZA', document: '84523901', address: 'SUBA', priority: 'alta' },
    { id: 1000011, name: 'LAURA GÓMEZ', document: '90318234', address: 'TEUSAQUILLO', priority: 'baja' },
    { id: 1000024, name: 'ANDRÉS FERNÁNDEZ', document: '77290123', address: 'USAQUÉN', priority: 'normal' },
    { id: 1000021, name: 'MÓNICA CÁRDENAS', document: '98234122', address: 'FONTIBÓN', priority: 'alta' },
    { id: 1000034, name: 'DIEGO RUIZ', document: '76890345', address: 'KENNEDY', priority: 'normal' },
    { id: 1000029, name: 'PATRICIA NIÑO', document: '89347218', address: 'SAN CRISTÓBAL', priority: 'baja' },
    { id: 1000014, name: 'JULIÁN TORO', document: '71420987', address: 'ENGATIVÁ', priority: 'normal' },
    { id: 1000028, name: 'MARCELA LÓPEZ', document: '81230987', address: 'BOSA', priority: 'alta' },
    { id: 1000040, name: 'FERNANDO CASTRO', document: '75620139', address: 'CHAPINERO', priority: 'normal' },
    { id: 1000013, name: 'LINA HERRERA', document: '83475029', address: 'CIUDAD BOLÍVAR', priority: 'baja' },
    { id: 1000035, name: 'RAFAEL SALAZAR', document: '88213456', address: 'USME', priority: 'normal' },
    { id: 1000020, name: 'VANESSA RAMOS', document: '77213450', address: 'TUNJUELITO', priority: 'alta' },
    { id: 1000032, name: 'HÉCTOR MORENO', document: '79281345', address: 'ANTONIO NARIÑO', priority: 'normal' },
    { id: 1000023, name: 'SANDRA PEÑA', document: '71429834', address: 'LA CANDELARIA', priority: 'baja' },
    { id: 1000009, name: 'NATALIA SUÁREZ', document: '80913427', address: 'BARRIOS UNIDOS', priority: 'normal' },
    { id: 1000010, name: 'OSCAR BELTRÁN', document: '77439821', address: 'RAFAEL URIBE URIBE', priority: 'alta' },
    { id: 1000019, name: 'MELISSA DÍAZ', document: '87213456', address: 'ENGATIVÁ', priority: 'normal' },
    { id: 1000033, name: 'JORGE BERMÚDEZ', document: '88209341', address: 'SANTA FE', priority: 'baja' },
    { id: 1000022, name: 'CAROLINA PÉREZ', document: '74321890', address: 'SUBA', priority: 'alta' },
    { id: 1000036, name: 'ANDREA CASTILLO', document: '76450981', address: 'USAQUÉN', priority: 'normal' },
    { id: 1000015, name: 'GERMÁN VILLALBA', document: '79318426', address: 'TEUSAQUILLO', priority: 'normal' },
    { id: 1000030, name: 'ISABEL REYES', document: '80123987', address: 'CHAPINERO', priority: 'alta' },
    { id: 1000038, name: 'CAMILO HERRERA', document: '72345981', address: 'BOSA', priority: 'baja' },
    { id: 1000018, name: 'MAURICIO QUINTERO', document: '89120345', address: 'KENNEDY', priority: 'normal' },
    { id: 1000016, name: 'LUISA MERCADO', document: '83201479', address: 'CIUDAD BOLÍVAR', priority: 'alta' },
    { id: 1000017, name: 'JUANITA ARIAS', document: '75489320', address: 'SANTA FE', priority: 'normal' },
    { id: 1000037, name: 'ALEJANDRA RIVERA', document: '80123765', address: 'SAN CRISTÓBAL', priority: 'baja' },
    { id: 1000007, name: 'DAVID MONSALVE', document: '78345012', address: 'USAQUÉN', priority: 'alta' },
    { id: 1000027, name: 'NORA SERRANO', document: '90213478', address: 'FONTIBÓN', priority: 'normal' },
    { id: 1000031, name: 'LUIS HERRERA', document: '76490231', address: 'KENNEDY', priority: 'alta' },
    { id: 1000026, name: 'CÉSAR JIMÉNEZ', document: '87419230', address: 'ENGATIVÁ', priority: 'baja' },
    { id: 1000012, name: 'ANA MARÍA MEJÍA', document: '84123095', address: 'RAFAEL URIBE URIBE', priority: 'normal' },

  ];
  
  visits: Visit[] = [];
  optimizedRoutes: any = {};
  
  // Variables para modales
  showEmergencyModal: boolean = false;
  emergencyVisit: any = {
    patientId: null,
    procedure: 'URGENCIA',
    time: '',
    duration: 30,
    nurseId: null
  };
  
  showNewPatientModal: boolean = false;
  newPatient: any = {
    name: '',
    document: '',
    documentType: 'CC',
    address: '',
    neighborhood: '',
    procedure: '',
    frequency: 12,
    startTime: '',
    duration: 30,
    days: 1,
    priority: 'normal'
  };
  
  draggedVisit: any = null;

  constructor(private router: Router) {

    this.nextDay = new Date(this.currentDate);
    this.nextDay.setDate(this.nextDay.getDate() + 1);
  }

  ngOnInit() {
    this.generateTimeSlots();
    this.loadOptimizedRoutes();
    this.initializeVisits();

  // Verificar si venimos de registrar un paciente
  const navigation = this.router.getCurrentNavigation();
  if (navigation?.extras?.state && navigation.extras.state['newPatient']) {
    const newPatient = navigation.extras.state['newPatient'];
    this.scheduleNewPatient(newPatient);
  }
}

private scheduleNewPatient(patientData: any) {
  // Buscar enfermera disponible (devuelve el ID directamente)
  const availableNurseId = this.findAvailableNurse(
    patientData.preferredTime, 
    patientData.duration
  );
  
  if (availableNurseId !== null) {
    // Obtener el nombre de la enfermera para mostrar en la visita
    const nurse = this.allNurses.find(n => n.id === availableNurseId);
    const nurseName = nurse ? nurse.name : 'Enfermera no asignada';

    const newVisit: Visit = {
      id: Math.max(0, ...this.visits.map(v => v.id)) + 1,
      patientId: patientData.id,
      patientName: `${patientData.name} ${patientData.lastName || ''}`.trim(),
      nurseId: availableNurseId, // Usamos el ID directamente
      procedure: patientData.procedure || 'Nuevo tratamiento',
      startTime: patientData.preferredTime,
      duration: patientData.duration,
      date: new Date(this.currentDate)
    };
    
    this.visits.push(newVisit);
    this.showToastMessage(
      'Paciente registrado',
      `El paciente ha sido asignado a ${nurseName}`,
      'success'
    );
  } else {
    this.showToastMessage(
      'Error',
      'No se encontró enfermera disponible para el horario solicitado (±1 hora)',
      'error'
    );
  }
}
  // Mantén solo esta versión de findAvailableNurse
  findAvailableNurse(preferredTime: string, duration: number): number | null {
    const [hours, minutes] = preferredTime.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    
    // Buscar enfermeras en turno
    const availableNurses = this.allNurses.filter(nurse => 
      this.isNurseInShift(nurse, time)
    );
    
    // Verificar disponibilidad ±1 hora
    const timeSlotsToCheck = [
      preferredTime,
      this.addMinutesToTime(preferredTime, 60),
      this.addMinutesToTime(preferredTime, -60)
    ];
    
    for (const slot of timeSlotsToCheck) {
      for (const nurse of availableNurses) {
        const endTime = this.addMinutesToTime(slot, duration);
        let isAvailable = true;
        
        for (const visit of this.visits) {
          if (visit.nurseId === nurse.id && 
              visit.date.toDateString() === this.currentDate.toDateString()) {
            
            const visitEnd = this.addMinutesToTime(visit.startTime, visit.duration);
            if (this.isTimeOverlap(slot, endTime, visit.startTime, visitEnd)) {
              isAvailable = false;
              break;
            }
          }
        }
        
        if (isAvailable) {
          return nurse.id; // Devolver solo el ID
        }
      }
    }
    
    return null;
  }
  

  loadOptimizedRoutes() {
    // Esto simularía la carga del JSON desde el backend
    this.optimizedRoutes = {  
      "1000001": [
            {
                "paciente": "1000001",
                "hora_inicio": "07:00",
                "hora_fin": "07:00"
            },
            {
                "paciente": "1000008",
                "hora_inicio": "07:00",
                "hora_fin": "07:45"
            },
            {
                "paciente": "1000011",
                "hora_inicio": "07:45",
                "hora_fin": "08:45"
            },
            {
                "paciente": "1000024",
                "hora_inicio": "08:45",
                "hora_fin": "09:00"
            },
            {
                "paciente": "1000024",
                "hora_inicio": "09:00",
                "hora_fin": "10:00"
            },
            {
                "paciente": "1000021",
                "hora_inicio": "10:00",
                "hora_fin": "10:30"
            },
            {
                "paciente": "1000034",
                "hora_inicio": "10:30",
                "hora_fin": "11:45"
            },
            {
                "paciente": "1000029",
                "hora_inicio": "11:45",
                "hora_fin": "12:30"
            }
        ],
        "1000002": [
            {
                "paciente": "1000002",
                "hora_inicio": "07:00",
                "hora_fin": "07:00"
            },
            {
                "paciente": "1000014",
                "hora_inicio": "07:00",
                "hora_fin": "07:45"
            },
            {
                "paciente": "1000028",
                "hora_inicio": "07:45",
                "hora_fin": "08:00"
            },
            {
                "paciente": "1000040",
                "hora_inicio": "08:00",
                "hora_fin": "08:30"
            },
            {
                "paciente": "1000013",
                "hora_inicio": "08:30",
                "hora_fin": "08:45"
            },
            {
                "paciente": "1000035",
                "hora_inicio": "08:45",
                "hora_fin": "09:00"
            }
        ],
        "1000003": [
            {
                "paciente": "1000003",
                "hora_inicio": "07:00",
                "hora_fin": "07:00"
            },
            {
                "paciente": "1000020",
                "hora_inicio": "07:00",
                "hora_fin": "07:30"
            },
            {
                "paciente": "1000032",
                "hora_inicio": "07:30",
                "hora_fin": "08:00"
            },
            {
                "paciente": "1000023",
                "hora_inicio": "08:00",
                "hora_fin": "08:30"
            },
            {
                "paciente": "1000009",
                "hora_inicio": "08:30",
                "hora_fin": "09:30"
            },
            {
                "paciente": "1000010",
                "hora_inicio": "09:30",
                "hora_fin": "10:00"
            },
            {
                "paciente": "1000019",
                "hora_inicio": "10:00",
                "hora_fin": "11:00"
            },
            {
                "paciente": "1000033",
                "hora_inicio": "11:00",
                "hora_fin": "12:00"
            },
            {
                "paciente": "1000022",
                "hora_inicio": "12:00",
                "hora_fin": "12:30"
            }
        ],
        "1000004": [
            {
                "paciente": "1000004",
                "hora_inicio": "07:00",
                "hora_fin": "07:00"
            },
            {
                "paciente": "1000036",
                "hora_inicio": "07:00",
                "hora_fin": "07:30"
            },
            {
                "paciente": "1000015",
                "hora_inicio": "07:30",
                "hora_fin": "08:00"
            },
            {
                "paciente": "1000030",
                "hora_inicio": "08:00",
                "hora_fin": "08:30"
            },
            {
                "paciente": "1000038",
                "hora_inicio": "08:30",
                "hora_fin": "09:00"
            },
            {
                "paciente": "1000018",
                "hora_inicio": "09:00",
                "hora_fin": "09:45"
            },
            {
                "paciente": "1000016",
                "hora_inicio": "09:45",
                "hora_fin": "10:15"
            },
            {
                "paciente": "1000017",
                "hora_inicio": "10:15",
                "hora_fin": "11:00"
            },
            {
                "paciente": "1000040",
                "hora_inicio": "10:00",
                "hora_fin": "11:30"
            }
        ],
        "1000005": [
            {
                "paciente": "1000005",
                "hora_inicio": "07:00",
                "hora_fin": "07:00"
            },
            {
                "paciente": "1000037",
                "hora_inicio": "07:00",
                "hora_fin": "07:45"
            },
            {
                "paciente": "1000006",
                "hora_inicio": "07:45",
                "hora_fin": "08:30"
            },
            {
                "paciente": "1000007",
                "hora_inicio": "08:30",
                "hora_fin": "09:30"
            },
            {
                "paciente": "1000027",
                "hora_inicio": "09:30",
                "hora_fin": "10:15"
            },
            {
                "paciente": "1000031",
                "hora_inicio": "10:15",
                "hora_fin": "10:45"
            },
            {
                "paciente": "1000026",
                "hora_inicio": "10:45",
                "hora_fin": "11:30"
            },
            {
                "paciente": "1000012",
                "hora_inicio": "11:30",
                "hora_fin": "11:45"
            }
        ]
    }
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
    // Limpiar visitas existentes
    this.visits = [];
    
    // Convertir las rutas optimizadas en visitas
    for (const nurseId in this.optimizedRoutes) {
      if (this.optimizedRoutes.hasOwnProperty(nurseId)) {
        const nurseVisits = this.optimizedRoutes[nurseId];
        const nurse = this.allNurses.find(n => n.id === parseInt(nurseId));
        
        if (nurse) {
          nurseVisits.forEach((visit: any, index: number) => {
            // El primer paciente es la ubicación de la enfermera
            if (index === 0 && visit.esEnfermera) {
              // No crear visita para la ubicación de la enfermera
              return;
            }
            
            const patient = this.patients.find(p => p.id === parseInt(visit.paciente));
            
            if (patient) {
              const duration = this.calculateDuration(visit.hora_inicio, visit.hora_fin);
              
              const newVisit: Visit = {
                id: Math.max(0, ...this.visits.map(v => v.id)) + 1,
                patientId: patient.id,
                patientName: patient.name,
                nurseId: nurse.id,
                procedure: (patient as any).priority === 'urgent' ? 'URGENCIA' : 'TRATAMIENTO',
                startTime: visit.hora_inicio,
                duration: duration,
                date: new Date(this.currentDate),
                isOptimizedSuggestion: true,
                originalNurseId: nurse.id,
                originalTime: visit.hora_inicio
              };
              
              this.visits.push(newVisit);
            }
          });
        }
      }
    }
    
    // Agregar algunas visitas existentes (simulando datos previos)
    this.visits.push(
      { id: 1001, patientId: 1000001, patientName: 'BLANCA VILLAMIL', nurseId: 1000050, 
        procedure: 'CADA 12', startTime: '13:00', duration: 30, date: new Date(this.currentDate) },
      // ... más visitas de ejemplo
    );
  }

  calculateDuration(startTime: string, endTime: string): number {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    return endMinutes - startMinutes;
  }

  setEditMode(mode: boolean) {
    this.editMode = mode;
    if (mode) {
      this.showToastMessage('Modo edición', 'Ahora puedes ajustar las asignaciones antes de confirmar el cronograma.', 'warning');
    }
  }
  
  changeDate(days: number) {
    this.currentDate = new Date(this.currentDate);
    this.currentDate.setDate(this.currentDate.getDate() + days);
    this.nextDay = new Date(this.currentDate);
    this.nextDay.setDate(this.nextDay.getDate() + 1);
    this.generateTimeSlots();
    this.initializeVisits();
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
  
  isNurseInShift(nurse: Nurse, time: Date): boolean {
    if (nurse.shift === 'morning') return this.isMorningShift(time);
    if (nurse.shift === 'afternoon') return this.isAfternoonShift(time);
    if (nurse.shift === 'night') return this.isNightShift(time);
    return false;
  }
  
  
  getShiftName(shift?: string): string {
    if (!shift) return 'Sin turno';
    switch(shift) {
      case 'morning': return 'Mañana';
      case 'afternoon': return 'Tarde';
      case 'night': return 'Noche';
      default: return shift;
    }
  }
  
  // Funciones para manejar las celdas y visitas
  isCellOccupied(nurse: any, time: Date): boolean {
    return this.getVisitInCell(nurse, time) !== null;
  }
  
  getVisitInCell(nurse: Nurse, time: Date): Visit | null {
    const timeStr = this.formatTime(time);
    
    for (const visit of this.visits) {
      if (visit.nurseId === nurse.id && visit.date.toDateString() === this.currentDate.toDateString()) {
        const visitStart = visit.startTime;
        const visitEnd = this.addMinutesToTime(visit.startTime, visit.duration);
        
        if (this.isTimeBetween(timeStr, visitStart, visitEnd)) {
          return visit;
        }
      }
    }
    return null;
  }
  
  isVisitStart(nurse: Nurse, time: Date): boolean {
    const visit = this.getVisitInCell(nurse, time);
    if (!visit) return false;
    
    const timeStr = this.formatTime(time);
    return visit.startTime === timeStr;
  }

  getVisitWidth(visit: Visit | null): number {
    if (!visit) return 0;
    return Math.max(100, (visit.duration / 15) * 100);
  }
  getVisitColor(visit: Visit | null): string {
    if (!visit) return '#ccc';
    
    if (visit.isEmergency) {
      return '#FFA07A';
    }
    
    if (visit.isOptimizedSuggestion && this.editMode) {
      return '#FFB347';
    }
    
    if (visit.procedure.toLowerCase().includes('instalación') || 
        visit.procedure.toLowerCase().includes('instalacion')) {
      return '#B19CD9';
    }
    
    return '#4e79a7';
  }
  

  isOptimizedSuggestion(nurse: Nurse, time: Date): boolean {
    if (!this.editMode) return false;
    
    const timeStr = this.formatTime(time);
    
    // Verificar si hay una sugerencia optimizada para esta enfermera y hora
    for (const nurseId in this.optimizedRoutes) {
      if (parseInt(nurseId) === nurse.id) {
        const nurseVisits = this.optimizedRoutes[nurseId];
        const matchingVisit = nurseVisits.find((v: any) => v.hora_inicio === timeStr);
        
        if (matchingVisit) {
          // Verificar que no haya una visita ya asignada en ese horario
          const existingVisit = this.visits.find(v => 
            v.nurseId === nurse.id && 
            v.date.toDateString() === this.currentDate.toDateString() &&
            v.startTime === timeStr
          );
          
          return !existingVisit;
        }
      }
    }
    
    return false;
  }

  // Funciones para arrastrar y soltar
  allowDrop(event: DragEvent) {
    if (this.editMode) {
      event.preventDefault();
    }
  }
  drag(event: DragEvent, visit: Visit | null) {
    if (!visit) return;
    
    if (this.editMode) {
      this.draggedVisit = visit;
      event.dataTransfer?.setData('text/plain', visit.id.toString());
    }
  }
  
  drop(event: DragEvent, nurse: Nurse, time: Date) {
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
      this.showToastMessage('Error', 'Solo puedes mover la visita hasta 1 hora antes o después de su horario original', 'error');
      return;
    }
    
    // Validar que la enfermera esté en turno
    if (!this.isNurseInShift(nurse, time)) {
      this.showToastMessage('Error', 'No puedes asignar la visita a una enfermera que no está en turno a esa hora', 'error');
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
          this.showToastMessage('Error', 'No puedes asignar dos visitas a la misma enfermera en el mismo horario', 'error');
          return;
        }
      }
    }
    
    // Actualizar la visita
    this.draggedVisit.nurseId = nurse.id;
    this.draggedVisit.startTime = timeStr;
    this.draggedVisit.date = new Date(this.currentDate);
    
    // Si era una sugerencia optimizada, marcarla como modificada
    if (this.draggedVisit.isOptimizedSuggestion) {
      this.draggedVisit.isOptimizedSuggestion = false;
    }
    
    // Resetear la visita arrastrada
    this.draggedVisit = null;
    
    this.showToastMessage('Visita movida', 'La visita ha sido reasignada correctamente', 'success');
  }
  
  cellClicked(nurse: Nurse, time: Date) {
    if (!this.editMode) return;
    
    const visit = this.getVisitInCell(nurse, time);
    if (visit) {
      if (confirm(`¿Deseas eliminar la visita de ${visit.patientName} a las ${visit.startTime}?`)) {
        this.visits = this.visits.filter(v => v.id !== visit.id);
        this.showToastMessage('Visita eliminada', `La visita de ${visit.patientName} ha sido eliminada`, 'success');
      }
    } else {
      // Si es un espacio vacío, abrir modal de urgencia
      this.emergencyVisit = {
        patientId: this.patients[0]?.id || null,
        procedure: 'URGENCIA',
        time: this.formatTime(time),
        duration: 30,
        nurseId: nurse.id
      };
      this.showEmergencyModal = true;
    }
  }
  
  // Funciones para manejar modales
  
  // Funciones para manejar modales
  openEmergencyModal() {
    // Obtener hora actual redondeada a los 15 minutos más cercanos
    const now = new Date();
    const minutes = Math.ceil(now.getMinutes() / 15) * 15;
    now.setMinutes(minutes);
    now.setSeconds(0);
    
    // Seleccionar enfermera del turno actual por defecto
    const currentHour = now.getHours();
    let defaultNurse;
    
    if (currentHour >= 7 && currentHour < 13) {
      defaultNurse = this.morningNurses[0]?.id;
    } else if (currentHour >= 13 && currentHour < 19) {
      defaultNurse = this.afternoonNurses[0]?.id;
    } else {
      defaultNurse = this.nightNurses[0]?.id;
    }
    
    this.emergencyVisit = {
      patientId: this.patients[0]?.id || null,
      procedure: 'URGENCIA',
      time: this.formatTime(now),
      duration: 30,
      nurseId: defaultNurse
    };
    this.showEmergencyModal = true;
  }
  
  
  closeEmergencyModal() {
    this.showEmergencyModal = false;
  }
  
  addEmergencyVisit() {
    // Validar campos obligatorios
    if (!this.emergencyVisit.patientId || !this.emergencyVisit.procedure || 
        !this.emergencyVisit.time || !this.emergencyVisit.nurseId) {
      this.showToastMessage('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }
  
    // Obtener datos del paciente y enfermera
    const patient = this.patients.find(p => p.id === this.emergencyVisit.patientId);
    const nurse = this.allNurses.find(n => n.id === this.emergencyVisit.nurseId);
    
    if (!patient || !nurse) {
      this.showToastMessage('Error', 'Datos inválidos de paciente o enfermera', 'error');
      return;
    }
  
    // Validar que la enfermera esté en turno a esa hora
    const timeParts = this.emergencyVisit.time.split(':');
    const visitTime = new Date();
    visitTime.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);
    
    if (!this.isNurseInShift(nurse, visitTime)) {
      this.showToastMessage('Error', `La enfermera ${nurse.name} no está en turno a esa hora`, 'error');
      return;
    }
  
    // Validar que no haya superposición con otras visitas
    const duration = parseInt(this.emergencyVisit.duration);
    const endTime = this.addMinutesToTime(this.emergencyVisit.time, duration);
    
    const hasConflict = this.visits.some(visit => {
      if (visit.nurseId === nurse.id && 
          visit.date.toDateString() === this.currentDate.toDateString()) {
        
        const existingStart = visit.startTime;
        const existingEnd = this.addMinutesToTime(visit.startTime, visit.duration);
        
        return this.isTimeOverlap(this.emergencyVisit.time, endTime, existingStart, existingEnd);
      }
      return false;
    });
  
    if (hasConflict) {
      this.showToastMessage('Error', 'La enfermera seleccionada ya tiene una visita programada en ese horario', 'error');
      return;
    }
  
    // Crear y agregar la nueva urgencia
    const newVisit: Visit = {
      id: Math.max(0, ...this.visits.map(v => v.id)) + 1,
      patientId: patient.id,
      patientName: patient.name,
      nurseId: nurse.id,
      procedure: this.emergencyVisit.procedure,
      startTime: this.emergencyVisit.time,
      duration: duration,
      date: new Date(this.currentDate),
      isEmergency: true
    };
  
    this.visits.push(newVisit);
    this.closeEmergencyModal();
    this.showToastMessage('Urgencia agregada', 'La visita de urgencia ha sido programada correctamente', 'success');
  }
  openNewPatientModal() {
    // Redirigir al componente de registro con parámetros de retorno
  this.router.navigate(['/registro-pacientes'], {
    state: {
      returnUrl: '/cronograma', // URL a la que regresar
      defaultData: {
        // Datos por defecto que podrías querer prellenar
        duration: 30,
        preferredTime: this.formatTime(new Date()) // Hora actual
      }
    }
  });
  }
  
  closeNewPatientModal() {
    this.showNewPatientModal = false;
  }

  addNewPatient() {
    // Validar campos obligatorios
    if (!this.newPatient.name || !this.newPatient.document || !this.newPatient.address || 
        !this.newPatient.procedure || !this.newPatient.startTime || !this.newPatient.duration) {
      this.showToastMessage('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }
    const availableNurse = this.findAvailableNurse(this.newPatient.startTime, parseInt(this.newPatient.duration, 10));
    
    if (!availableNurse) {
      this.showToastMessage('Error', 'No hay enfermeras disponibles en este horario', 'error');
      return;
    }

    // Agregar nuevo paciente
    const newPatientId = Math.max(0, ...this.patients.map(p => p.id)) + 1;
    this.patients.push({
      id: newPatientId,
      name: this.newPatient.name,
      document: this.newPatient.document,
      documentType: this.newPatient.documentType,
      address: this.newPatient.address,
      neighborhood: this.newPatient.neighborhood,
      priority: this.newPatient.priority
    });
    
    // Crear la nueva visita
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
    this.showToastMessage('Paciente registrado', 'El paciente ha sido registrado y la visita agendada exitosamente', 'success');
  }


  // Funciones para confirmar cronograma
  confirmSchedule() {
    // Validar que no queden sugerencias optimizadas sin asignar
    const unassignedSuggestions = this.hasUnassignedOptimizedSuggestions();
    
    if (unassignedSuggestions) {
      if (!confirm('Hay sugerencias de asignación optimizada que no han sido asignadas. ¿Deseas continuar sin asignarlas?')) {
        return;
      }
    }
    
    // Marcar todas las visitas como no optimizadas (ahora son oficiales)
    this.visits.forEach(visit => {
      visit.isOptimizedSuggestion = false;
    });
    
    this.editMode = false;
    this.showToastMessage('Cronograma confirmado', 'El cronograma ha sido confirmado y es ahora oficial', 'success');
    
    // Aquí iría el código para enviar al backend
    // this.sendScheduleToBackend();
  }

  hasUnassignedOptimizedSuggestions(): boolean {
    for (const nurseId in this.optimizedRoutes) {
      const nurse = this.allNurses.find(n => n.id === parseInt(nurseId));
      if (nurse) {
        const nurseVisits = this.optimizedRoutes[nurseId];
        
        for (const visit of nurseVisits) {
          const timeStr = visit.hora_inicio;
          const isAssigned = this.visits.some(v => 
            v.nurseId === nurse.id && 
            v.date.toDateString() === this.currentDate.toDateString() &&
            v.startTime === timeStr
          );
          
          if (!isAssigned) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
  getAvailableNursesForEmergency(): Nurse[] {
    return this.allNurses.filter(nurse => {
      // Filtrar enfermeras que están en turno en el momento actual
      const now = new Date();
      return this.isNurseInShift(nurse, now);
    });
  }
  getShiftTimeRange(nurseId: number): string {
    const nurse = this.allNurses.find(n => n.id === nurseId);
    if (!nurse) return '';
    
    switch(nurse.shift) {
      case 'morning': return '07:00 - 13:00';
      case 'afternoon': return '13:00 - 19:00';
      case 'night': return '19:00 - 07:00';
      default: return '';
    }
  }

  getMinTimeForNurse(nurseId: number): string {
    const nurse = this.allNurses.find(n => n.id === nurseId);
    if (!nurse) return '07:00';
    
    switch(nurse.shift) {
      case 'morning': return '07:00';
      case 'afternoon': return '13:00';
      case 'night': return '19:00';
      default: return '07:00';
    }
  }

  getMaxTimeForNurse(nurseId: number): string {
    const nurse = this.allNurses.find(n => n.id === nurseId);
    if (!nurse) return '19:00';
    
    switch(nurse.shift) {
      case 'morning': return '13:00';
      case 'afternoon': return '19:00';
      case 'night': return '23:45'; // Permitir hasta casi medianoche
      default: return '19:00';
    }
  }
  updateTimeLimits() {
    // Actualizar los límites de tiempo cuando cambia la enfermera seleccionada
    if (this.emergencyVisit.nurseId) {
      const currentTime = this.emergencyVisit.time;
      const minTime = this.getMinTimeForNurse(this.emergencyVisit.nurseId);
      
      if (currentTime < minTime) {
        this.emergencyVisit.time = minTime;
      }
    }
  }
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
  
  getVisitTooltip(visit: Visit | null): string {
    if (!visit) return '';
    
    const patient = this.patients.find(p => p.id === visit.patientId);
    let tooltip = `Paciente: ${visit.patientName}\n`;
    tooltip += `Procedimiento: ${visit.procedure}\n`;
    tooltip += `Hora: ${visit.startTime}\n`;
    tooltip += `Duración: ${visit.duration} minutos\n`;
    
    if (patient) {
      tooltip += `Documento: ${patient.document}\n`;
      tooltip += `Dirección: ${patient.address}\n`;
    }
    
    if (visit.isEmergency) {
      tooltip += `\n(URGENCIA)`;
    } else if (visit.isOptimizedSuggestion) {
      tooltip += `\n(SUGERENCIA OPTIMIZADA)`;
    }
    
    return tooltip;
  }
  

  // Funciones para toast notifications
  showToastMessage(title: string, message: string, type: 'success' | 'error' | 'warning') {
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    // Ocultar después de 5 segundos
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 5000);
  }
  
  hideToast() {
    this.showToast = false;
  }
  copyScheduleToNextDay() {
    // Aquí iría el código para copiar el cronograma al siguiente día
  }
}
