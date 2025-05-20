import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, concatMap, finalize, forkJoin, map, Observable, of, throwError } from 'rxjs';
import { Visita } from 'src/app/model/visit';
import { NurseService } from 'src/app/service/nurse.service';
import { OptimizationDataService } from 'src/app/service/optimization-data.service';
import { PatientService } from 'src/app/service/patient.service';
import { VisitsService } from 'src/app/service/visits.service';

interface Visit {
  id: number;
  patientId: number;
  actividadPacienteVisita?: number;
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
  actividadPacienteVisita: number;
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

  morningNurses: Nurse[] = [];
  afternoonNurses: Nurse[] = [];
  nightNurses: Nurse[] = [];
  allNurses: Nurse[] = [];
  patients: Patient[] = [];
  visits: Visit[] = [];
  optimizedRoutes: { [nurseId: string]: any[] } = {};
  
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

  constructor(private cdr: ChangeDetectorRef , private router: Router, public optimizacionData: OptimizationDataService, private nursesService: NurseService, private patientsService: PatientService, private visitsService: VisitsService) {
    this.nextDay = new Date(this.currentDate);
    this.nextDay.setDate(this.nextDay.getDate() + 1);
  }

  // VISITA : PARA LA BD
  visitas: Visita[] = [];
  nuevaVisita: Visita = {
    actividadPacienteVisitaId: 0,
    enfermeraId: 0
  };
  isLoading: boolean = false;
  loadingProgress: number = 0;
  loadingProgressText: string = 'Inicializando...';
  private isLoadingSchedule: boolean = false;

  ngOnInit() {
  
    if (this.optimizacionData.getBorrador()) {
    // Set loading state
    this.isLoading = true;
    this.loadingProgress = 10;
    this.loadingProgressText = 'Inicializando componentes...';

    // Generate time slots (existing code)
    this.generateTimeSlots();
    this.loadingProgress = 20;
    this.loadingProgressText = 'Generando franjas horarias...';
    this.fetchInitialData();
 
    this.simulateLoading(() => {
      this.loadOptimizedRoutesBorrador();
    });
    this.editMode = true;
  } else {
      this.generateTimeSlots();
      this.loadScheduleFromDB();
      this.cdr.detectChanges(); // Ensure UI updates
  }

  // Check if navigating from patient registration
  const navigation = this.router.getCurrentNavigation();
  if (navigation?.extras?.state && navigation.extras.state['newPatient']) {
    const newPatient = navigation.extras.state['newPatient'];
    this.scheduleNewPatient(newPatient);
  }
}

fetchInitialData() {
    // Fetch nurses and patients from OptimizationDataService
    const allEnfermeras = this.optimizacionData.getAllEnfermeras();
    const allPacientes = this.optimizacionData.getAllPacientes();
    
    // Process nurses
    this.allNurses = [];
    if (allEnfermeras.dataEnfermerasManana) {
      this.morningNurses = allEnfermeras.dataEnfermerasManana.map((n: any) => ({
        id: n.id,
        name: (n.nombre + " " + n.apellido) || 'Unknown',
        shift: 'morning',
        address: n.direccion || '',
        latitude: n.latitud,
        longitude: n.longitud,
      }));
      this.allNurses.push(...this.morningNurses);
    }
    if (allEnfermeras.dataEnfermerasTarde) {
      this.afternoonNurses = allEnfermeras.dataEnfermerasTarde.map((n: any) => ({
        id: n.id,
        name: (n.nombre + " " + n.apellido) || 'Unknown',
        shift: 'afternoon',
        address: n.direccion || '',
        latitude: n.latitud,
        longitude: n.longitud,
      }));
      this.allNurses.push(...this.afternoonNurses);
    }
    if (allEnfermeras.dataEnfermerasNoche) {
      this.nightNurses = allEnfermeras.dataEnfermerasNoche.map((n: any) => ({
        id: n.id, //Cambiado desde numeroIdentifica
        name: (n.nombre + " " + n.apellido) || 'Unknown',
        shift: 'night',
        address: n.direccion || '',
        latitude: n.latitud,
        longitude: n.longitud,
      }));
      this.allNurses.push(...this.nightNurses);
    }

    console.log("Enfermeras cargadas:", this.allNurses);

    if (!this.allNurses.length) {
      this.showToastMessage('Error', 'No se encontraron datos de enfermeras', 'error');
    }

    this.loadingProgress = 40;
    this.loadingProgressText = 'Enfermeras cargadas...';

    // Process patients
    this.patients = [];
    const patientSources = [
      allPacientes.dataPacientesManana,
      allPacientes.dataPacientesTarde,
      allPacientes.dataPacientesNoche,
    ];
    patientSources.forEach((source) => {
      if (source) {
        const mappedPatients = source.map((p: any) => ({
          id: p.id,
          name: p.nombre || 'Unknown',
          actividadPacienteVisita: p.actividades[0].id || 0, //Agregado para obtener el ActiviadPacienteVisita id
          document: p.numero_identificacion,
          address: p.direccion || '',
          latitude: p.latitud,
          longitude: p.longitu
        }));
        this.patients.push(...mappedPatients);
      }
    });
    if (!this.patients.length) {
      this.showToastMessage('Error', 'No se encontraron datos de pacientes', 'error');
    }

    this.loadingProgress = 60;
    this.loadingProgressText = 'Pacientes cargados...';

    // Fetch optimized routes or load from draft
    this.simulateLoading(() => {
      if (this.optimizacionData.getBorrador()) {
        this.loadOptimizedRoutesBorrador();
      } else {
        // this.loadOptimizedRoutes(); // REVISAR
      }
      this.initializeVisits();
      console.log('Visitas generadas:', this.visits);
    });
  }

getNurses(): Observable<Nurse[]> {
  return this.nursesService.findAll(0, 50).pipe(
    map((nurses: any[]) =>
      nurses.map((nurse) => ({
        ...nurse,
        shift: this.getShiftName(nurse.tipoTurnoId),
      }))
    )
  );
}

getPatients(): Observable<Patient[]> {
  return this.patientsService.findAll(0, 50).pipe(
    map((patients: any[]) => patients.map((patient) => ({ ...patient })))
  );
}

simulateLoading(callback: () => void) {
  // First check if response is immediately available
  const respuestaManana = this.optimizacionData.getRespuestaManana();
  
  if (respuestaManana && respuestaManana.rutas) {
    // If response is already available, still show a brief loading animation
    let progress = 30;
    const interval = setInterval(() => {
      this.loadingProgress = progress;
      
      if (progress === 30) {
        this.loadingProgressText = 'Procesando rutas optimizadas...';
      } else if (progress === 60) {
        this.loadingProgressText = 'Generando cronograma...';
      } else if (progress === 80) {
        this.loadingProgressText = 'Finalizando...';
      }
      
      progress += 20;
      
      if (progress > 100) {
        clearInterval(interval);
        callback();
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    }, 400);
  } else {
    // Response not yet available - poll for it
    this.loadingProgress = 30;
    this.loadingProgressText = 'Esperando datos de optimización...';
    
    const maxWaitTime = 30000; // 30 seconds maximum wait time
    const checkInterval = 500; // check every 500ms
    let elapsedTime = 0;
    let lastProgressUpdate = Date.now();
    
    const waitForResponse = setInterval(() => {
      const response = this.optimizacionData.getRespuestaManana();
      elapsedTime += checkInterval;
      
      // Update progress based on elapsed time
      const currentTime = Date.now();
      if (currentTime - lastProgressUpdate > 1000) { // Update progress every second
        // Increment progress slowly until 80%
        if (this.loadingProgress < 80) {
          this.loadingProgress += 2;
          
          // Update text based on progress
          if (this.loadingProgress > 30 && this.loadingProgress <= 50) {
            this.loadingProgressText = 'Calculando rutas óptimas...';
          } else if (this.loadingProgress > 50 && this.loadingProgress <= 70) {
            this.loadingProgressText = 'Procesando respuesta...';
          } else if (this.loadingProgress > 70) {
            this.loadingProgressText = 'Casi listo...';
          }
        }
        lastProgressUpdate = currentTime;
      }
      
      if (response && response.rutas) {
        // Response received
        clearInterval(waitForResponse);
        console.log("Datos de optimización recibidos");
        
        // Jump to almost complete
        this.loadingProgress = 80;
        this.loadingProgressText = 'Generando cronograma...';
        
        // Simulate final loading steps
        setTimeout(() => {
          this.loadingProgress = 90;
          this.loadingProgressText = 'Finalizando...';
          
          setTimeout(() => {
            this.loadingProgress = 100;
            callback();
            
            // Hide loading overlay after a small delay
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          }, 500);
        }, 500);
      } else if (elapsedTime >= maxWaitTime) {
        // Timeout after waiting too long
        clearInterval(waitForResponse);
        console.error("Tiempo de espera agotado para datos de optimización");
        
        this.loadingProgress = 100;
        this.loadingProgressText = 'Error: Tiempo de espera agotado';
        
        setTimeout(() => {
          this.isLoading = false;
          // Show error message to user
          this.showToastMessage( 'Error',
            'Error al procesar datos de optimización',
            'error'
          );}, 1000);
      }
    }, checkInterval);
  }
}

// Modified loadOptimizedRoutesBorrador to handle errors
loadOptimizedRoutesBorrador() {
  try {
    const respuestaManana = this.optimizacionData.getRespuestaManana();
    const respuestaTarde = this.optimizacionData.getRespuestaTarde();
    const respuestaNoche = this.optimizacionData.getRespuestaNoche();

    this.optimizedRoutes = {}; // Reiniciar

    const procesarRutas = (respuesta: any) => {
      if (respuesta?.rutas && typeof respuesta.rutas === 'object') {
        Object.entries(respuesta.rutas).forEach(([nurseId, visitas]) => {
          const visitasFiltradas = (visitas as any[]).slice(1); // Ignorar primer paciente
          this.optimizedRoutes[nurseId] = visitasFiltradas;
        });
      }
    };
       
    procesarRutas(respuestaManana);
    procesarRutas(respuestaTarde);
    procesarRutas(respuestaNoche);

    if (Object.keys(this.optimizedRoutes).length > 0) {
      console.log("Rutas cargadas en cronograma:", this.optimizedRoutes);
      this.initializeVisits();
    } else {
      throw new Error("Ninguna de las respuestas contiene rutas válidas.");
    }

  } catch (error) {
    console.error("Error al cargar rutas optimizadas:", error);
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
      actividadPacienteVisita: patientData.actividadPacienteVisita, //REVISARRR
      patientName: `${patientData.name} ${patientData.lastName || ''}`.trim(),
      nurseId: availableNurseId, // Usamos el ID directamente
      procedure: patientData.procedure || 'Nuevo tratamiento',
      startTime: patientData.preferredTime,
      duration: patientData.duration,
      date: new Date(this.currentDate.setHours(0, 0, 0, 0))

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
        const nurse = this.allNurses.find(n => n.id == parseInt(nurseId));

        console.log("Nurse Visits:", nurseVisits);
        if (nurse) {
          nurseVisits.forEach((visit: any, index: number) => {
            if (index == 0 && visit.esEnfermera) {
              return;
            }
            
            const patient = this.patients.find(p => p.id == parseInt(visit.paciente));
            if (patient) {
              const duration = this.calculateDuration(visit.hora_inicio, visit.hora_fin);
              
              const newVisit: Visit = {
                id: Math.max(0, ...this.visits.map(v => v.id)) + 1,
                patientId: patient.id,
                actividadPacienteVisita: patient.actividadPacienteVisita,
                patientName: patient.name,
                nurseId: nurse.id,
                procedure: (patient as any).priority === 'urgent' ? 'URGENCIA' : 'TRATAMIENTO',
                startTime: visit.hora_inicio,
                duration: duration,
                date: new Date(this.currentDate.setHours(0, 0, 0, 0)),
                isOptimizedSuggestion: true,
                originalNurseId: nurse.id,
                originalTime: visit.hora_inicio
              };

              console.log("Nueva visita:", newVisit);
              
              this.visits.push(newVisit);
            }
          });
        }
      }
    }
    console.log("Visitas finales:", this.visits);
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
    // this.generateTimeSlots();
    // this.initializeVisits();
    this.loadScheduleFromDB();
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
  
  
  getShiftName(shiftId?: number): string {
  switch (shiftId) {
      case 1:
        return 'morning';
      case 2:
        return 'afternoon';
      case 3:
        return 'night';
      default:
        return 'unknown';
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
    const slotTime = this.formatTime(time); // Ej: "09:00"
    return this.visits.some(visit => {
      const visitTime = visit.startTime; // Ej: "09:26"
      const visitMinutes = this.timeToMinutes(visitTime);
      const slotMinutes = this.timeToMinutes(slotTime);
      return (
        visit.nurseId === nurse.id &&
        visit.date.getTime() === this.currentDate.getTime() &&
        Math.abs(visitMinutes - slotMinutes) < 15 // Tolerancia de 15 minutos
      );
    });
  }
  
  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
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

  const newTimeStr = this.formatTime(time);
  const newTime = new Date(this.currentDate);
  const [newHour, newMin] = newTimeStr.split(':').map(Number);
  newTime.setHours(newHour, newMin, 0, 0);

  const originalTimeStr = this.draggedVisit.originalTime!;
  const [origHour, origMin] = originalTimeStr.split(':').map(Number);
  const originalTime = new Date(this.currentDate);
  originalTime.setHours(origHour, origMin, 0, 0);

  const diffMinutes = Math.abs(newTime.getTime() - originalTime.getTime()) / 60000;

  if (diffMinutes > 60) {
    this.showToastMessage('Error', 'Solo puedes mover la visita hasta 1 hora antes o después de su horario ideal', 'error');
    return;
  }

  if (!this.isNurseInShift(nurse, newTime)) {
    this.showToastMessage('Error', 'La enfermera no está en turno a esa hora', 'error');
    return;
  }

  const duration = this.draggedVisit.duration;
  const newEndTimeStr = this.addMinutesToTime(newTimeStr, duration);

  const hasConflict = this.visits.some(visit =>
    visit.id !== this.draggedVisit!.id &&
    visit.nurseId === nurse.id &&
    visit.date.toDateString() === this.currentDate.toDateString() &&
    this.isTimeOverlap(newTimeStr, newEndTimeStr, visit.startTime, this.addMinutesToTime(visit.startTime, visit.duration))
  );

  if (hasConflict) {
    this.showToastMessage('Error', 'La enfermera ya tiene una visita en ese horario', 'error');
    return;
  }

  this.draggedVisit.nurseId = nurse.id;
  this.draggedVisit.startTime = newTimeStr;
  this.draggedVisit.date = new Date(this.currentDate);
  this.draggedVisit.isOptimizedSuggestion = false;

  this.draggedVisit = null;
  this.showToastMessage('Visita movida', 'La visita fue reasignada correctamente', 'success');
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

  // Funciones para confirmar cronograma
  confirmSchedule() {
    // Validar que no queden sugerencias optimizadas sin asignar
    const unassignedSuggestions = this.hasUnassignedOptimizedSuggestions();
  
    if (unassignedSuggestions) {
      if (!confirm('Hay sugerencias de asignación optimizada que no han sido asignadas. ¿Deseas continuar sin asignarlas?')) {
        return;
      }
    }

    // Validar que haya visitas para guardar
    if (!this.visits.length) {
      this.showToastMessage('Advertencia', 'No hay visitas para guardar.', 'warning');
      return;
    }
  
    // Mapear las visitas del frontend (Visit) al formato del backend (Visita)
    const visitasToSave: Visita[] = this.visits.map((visit: Visit) => {
      // Convertir la fecha al formato ISO (YYYY-MM-DD)
      const fechaVisita = visit.date.toISOString().split('T')[0];
  
      // Calcular horaFinEjecutada sumando la duración a startTime
      const startTimeParts = visit.startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(startTimeParts[0], startTimeParts[1], 0, 0);
      const endDate = new Date(startDate.getTime() + visit.duration * 60000); // Duración en minutos a milisegundos
  
      const horaInicioEjecutada = visit.startTime + ':00'; // Agregar segundos (HH:mm:ss)
      const horaFinEjecutada = this.formatTime(endDate) + ':00'; // Convertir endDate a HH:mm:ss
  
      // Usar horaInicioCalculada y horaFinCalculada si están disponibles, o asumir que son iguales a las ejecutadas
      const horaInicioCalculada = visit.originalTime ? visit.originalTime + ':00' : horaInicioEjecutada;
      const horaFinCalculada = visit.originalTime
        ? this.addMinutesToTime(visit.originalTime, visit.duration) + ':00'
        : horaFinEjecutada;
  
      return {
        actividadPacienteVisitaId: visit.actividadPacienteVisita,
        enfermeraId: visit.nurseId,
        fechaVisita: fechaVisita,
        estado: visit.isEmergency ? 'URGENCIA' : 'PROGRAMADA', // Asignar estado según tipo de visita
        horaInicioCalculada: horaInicioCalculada,
        horaFinCalculada: horaFinCalculada
      };
    });
  
    // Mostrar estado de carga
    this.isLoading = true;
    this.loadingProgress = 10;
    this.loadingProgressText = 'Guardando visitas...';
  
    // Enviar todas las visitas al backend usando forkJoin para manejar múltiples solicitudes
    console.log("Visitas a enviar:", visitasToSave);
    const saveRequests = visitasToSave.map((visita) =>
      this.visitsService.createVisit(visita).pipe(
        catchError((error) => {
          console.error('Error al guardar visita:', error);
          this.showToastMessage('Error', 'Error al guardar una visita.', 'error');
          return of(null); // Continuar con otras solicitudes incluso si una falla
        })
      )
    );
  
    forkJoin(saveRequests).subscribe({
      next: (results) => {
        // Filtrar resultados exitosos (ignorar los null)
        const savedVisits = results.filter((result): result is Visita => result !== null);
        savedVisits.forEach(saved => {
        const match = this.visits.find(v =>
          v.actividadPacienteVisita === saved.actividadPacienteVisitaId &&
          this.formatDateToLocalDate(v.date) === saved.fechaVisita &&
          v.nurseId === saved.enfermeraId &&
          v.startTime + ':00' === saved.horaInicioCalculada
        );
        if (match) {
          match.id = saved.id!;
        }
      });

  
        // Actualizar estado
        this.loadingProgress = 100;
        this.loadingProgressText = 'Visitas guardadas correctamente';
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
  
        // Marcar todas las visitas como no optimizadas (ahora son oficiales)
        this.visits.forEach((visit) => {
          visit.isOptimizedSuggestion = false;
        });
  
        // Limpiar borrador si existe
        if (this.optimizacionData.getBorrador()) {
          this.optimizacionData.setBorrador(false);
        }
  
        // Desactivar modo edición
        this.editMode = false;
  
        // Mostrar notificación de éxito
        this.showToastMessage(
          'Cronograma confirmado',
          `Se guardaron ${savedVisits.length} de ${visitasToSave.length} visitas correctamente.`,
          savedVisits.length === visitasToSave.length ? 'success' : 'warning'
        );
      },
      error: (error) => {
        // Error general en el proceso de guardado
        console.error('Error al guardar el cronograma:', error);
        this.isLoading = false;
        this.showToastMessage('Error', 'No se pudo guardar el cronograma.', 'error');
      }
    });
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

  cancelSchedule() {
    // Mostrar mensaje de confirmación al usuario
    const confirmCancel = confirm(
      "Los cambios no guardados se perderán. ¿Está seguro de que desea cancelar?"
    );
  
    if (confirmCancel) {
      // Si el usuario acepta, proceder con la cancelación
      if (this.optimizacionData.getBorrador()) {
        this.setEditMode(false);
        this.visits = [];
        // Cargar cronograma desde la base de datos
        this.loadScheduleFromDB();
      } else {
        this.setEditMode(false);
        this.loadScheduleFromDB();
      }
    }
    // Si el usuario no acepta, no se hace nada y se mantiene el estado actual
  }
  
  // Método auxiliar para cargar el cronograma desde la base de datos (ejemplo)
  loadScheduleFromDB(){ 
    if (this.isLoadingSchedule) {
    console.log('Schedule loading already in progress');
    return;
  }
  this.isLoadingSchedule = true;
  this.isLoading = true;
  this.loadingProgress = 10;
  this.loadingProgressText = 'Cargando datos iniciales...';

  this.morningNurses = [];
  this.afternoonNurses = [];
  this.nightNurses = [];
  this.visits = []; // Clear existing visits

  this.cargarEnfermeras()
    .pipe(
      concatMap(() => {
        console.log('Current date:', this.formatDateToLocalDate(this.currentDate));
        return forkJoin({
          patients: this.patients.length ? of(this.patients) : this.cargarPacientes(),
          visits: this.visitsService.getAllVisits(0, 100, this.formatDateToLocalDate(this.currentDate)),
        });
      }),
      concatMap(({ patients, visits }) => {
        this.patients = patients;

        this.loadingProgress = 50;
        this.loadingProgressText = 'Cargando visitas...';

        const validVisits = visits.content.filter((visit: Visita) =>
          visit.actividadPacienteVisitaId !== undefined &&
          visit.fechaVisita !== undefined &&
          visit.horaInicioCalculada !== undefined &&
          visit.enfermeraId !== undefined
        );

        if (validVisits.length === 0) {
          console.warn('No valid visits found with required fields');
          this.loadingProgress = 100;
          this.loadingProgressText = 'No se encontraron visitas válidas';
          this.isLoading = false;
          this.isLoadingSchedule = false;
          this.showToastMessage('Advertencia', 'No se encontraron visitas válidas para cargar', 'warning');
          return of(null);
        }

        console.log('Valid visits:', validVisits);

        this.classifyNursesByShift(validVisits);

        this.loadingProgress = 75;
        this.loadingProgressText = 'Clasificando enfermeras...';

        const visitInfoRequests = validVisits.map((visit: Visita) =>
          this.visitsService.getActividadVisitaPacienteById(visit.actividadPacienteVisitaId!).pipe(
            map((response) => ({
              visit,
              actividad: response,
            })),
            catchError((error) => {
              console.warn(`Failed to fetch actividad for visit ${visit.id}:`, error);
              return of({
                visit,
                actividad: null,
              });
            })
          )
        );

        return forkJoin(visitInfoRequests);
      })
    )
    .subscribe({
      next: (results) => {
        if (!results) return;

        this.visits = results
          .filter((result) => result.actividad !== null)
          .map((result) => {
            const { visit, actividad } = result;
            const patient = this.patients.find((p) => p.id === (actividad?.pacienteId ?? 0));
            const duration = actividad?.duracionVisita ?? 30;
            return {
              id: visit.id,
              patientId: actividad?.pacienteId ?? 0,
              actividadPacienteVisita: visit.actividadPacienteVisitaId,
              patientName: patient ? patient.name : 'Unknown',
              nurseId: visit.enfermeraId,
              procedure: visit.estado === 'URGENCIA' ? 'URGENCIA' : 'TRATAMIENTO',
              startTime: visit.horaInicioCalculada!.split(':').slice(0, 2).join(':'),
              duration: duration,
              date: new Date(this.currentDate.setHours(0, 0, 0, 0)),
              isEmergency: visit.estado === 'URGENCIA',
              isOptimizedSuggestion: false,
              originalTime: (visit.horaInicioCalculada || visit.horaInicioEjecutada || '')
              .split(':')
              .slice(0, 2)
              .join(':'),
              originalNurseId: visit.enfermeraId     
            } as Visit;
          });

        this.loadingProgress = 90;
        this.loadingProgressText = 'Finalizando carga de visitas...';

        console.log('Transformed visits:', this.visits);
      },
      error: (error) => {
        console.error('Error cargando datos iniciales:', error);
        this.loadingProgressText = 'Error cargando datos iniciales';
        this.isLoading = false;
        this.isLoadingSchedule = false;
        this.showToastMessage('Error', 'No se pudieron cargar pacientes o visitas', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.isLoadingSchedule = false;
        this.loadingProgress = 100;
        this.loadingProgressText = 'Carga completa';
        console.log('Morning nurses:', this.morningNurses);
        console.log('Afternoon nurses:', this.afternoonNurses);
        console.log('Night nurses:', this.nightNurses);
        console.log('Final visits after loadScheduleFromDB:', this.visits);
        this.cdr.detectChanges();
      },
    });
  } 

  classifyNursesByShift(visits: Visita[]): void {
    const morning: Nurse[] = [];
    const afternoon: Nurse[] = [];
    const night: Nurse[] = [];
  
    visits.forEach((visit: Visita) => {
      if (!visit.enfermeraId || !visit.horaInicioCalculada) {
        console.warn(`Visit ${visit.id} missing enfermeraId or horaInicioCalculada`);
        return;
      }
  
      const nurse = this.allNurses.find((n) => n.id === visit.enfermeraId);
      if (!nurse) {
        console.warn(`Nurse with ID ${visit.enfermeraId} not found for visit ${visit.id}`);
        return;
      }
  
      const [hours, minutes] = visit.horaInicioCalculada.split(':').map(Number);
      const timeInHours = hours + minutes / 60;
  
      if (timeInHours >= 7 && timeInHours < 13) {
        if (!morning.some((n) => n.id === nurse.id)) {
          morning.push(nurse);
        }
      } else if (timeInHours >= 13 && timeInHours < 19) {
        if (!afternoon.some((n) => n.id === nurse.id)) {
          afternoon.push(nurse);
        }
      } else {
        if (!night.some((n) => n.id === nurse.id)) {
          night.push(nurse);
        }
      }
    });
  
    // Assign new array references
    this.morningNurses = [...morning];
    this.afternoonNurses = [...afternoon];
    this.nightNurses = [...night];

  
    // Trigger change detection
    this.cdr.detectChanges();
  
    console.log('Classified nurses:', {
      morning: this.morningNurses,
      afternoon: this.afternoonNurses,
      night: this.nightNurses,
    });
  }

  
  
  cargarEnfermeras(): Observable<Nurse[]> {
    return this.nursesService.findAll(0, 100).pipe(
      map((response) => {
        const nurses = (response.content || response).map((e: any) => ({
          id: e.id,
          name: e.nombre || 'Unknown', // Map nombre to name
          lastName: e.apellido || '',
          numeroIdentificacion: e.numeroIdentificacion || '',
          phone: e.telefono || '',
          shiftId: e.turnoEntity?.id ?? null,
          latitude: e.latitud ?? 0,
          longitude: e.longitud ?? 0,
          shift: this.getShiftName(e.turnoEntity?.id),
        })) as Nurse[];
        this.allNurses = nurses;
        console.log("Enfermeras cargadas", this.allNurses);
        return nurses;
      }),
      catchError((error) => {
        console.error('Error al cargar enfermeras', error);
        this.showToastMessage('Error', 'No se pudieron cargar las enfermeras', 'error');
        this.isLoading = false;
        return throwError(() => error);
      }),
      finalize(() => {
      })
    );
  }
  cargarPacientes(): Observable<Patient[]> {
    this.isLoading = true;
    return this.patientsService.findAll(0, 50).pipe(
      map((response) => {
        const patients = (response.content || response).map((p: any) => ({
          id: p.id,
          name: p.nombre || 'Unknown', // Map nombre to name
          lastName: p.apellido || '',
          document: p.numero_identificacion || '',
          documentType: p.tipo_identificacion || 'CC',
          address: p.direccion || '',
          phone: p.telefono || '',
          email: p.email || '',
          relativeName: p.nombre_familiar || '',
          relativeRelationship: p.relacion_familiar || '',
          relativePhone: p.telefono_familiar || '',
          neighborhood: p.barrio || '',
          complex: p.complejo || '',
          latitude: p.latitud ?? 0,
          longitude: p.longitud ?? 0,
          priority: p.prioridad || 'normal',
          actividadPacienteVisita: p.actividades?.[0]?.id || 0, // Map actividad if available
        })) as Patient[];
        this.patients = patients;
        console.log('Pacientes obtenidos:', this.patients);
        return patients;
      }),
      catchError((error) => {
        console.error('Error al obtener pacientes:', error);
        this.showToastMessage('Error', 'No se pudieron cargar los pacientes', 'error');
        this.isLoading = false;
        return throwError(() => error);
      }),
      finalize(() => {
      })
    );
  }
  

  private formatDateToLocalDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      throw new Error('Invalid date format');
    }
  
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(dateObj.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`; // Returns yyyy-MM-dd, e.g., 2025-05-12
  }

  public actualizarVisitasEditadas() {
  const visitasModificadas: Visita[] = this.visits
    .filter((visit) =>
      visit.id &&
      (visit.nurseId !== visit.originalNurseId || visit.startTime !== visit.originalTime)
    )
    .map((visit) => ({
      id: visit.id!,
      enfermeraId: visit.nurseId,
      horaInicioCalculada: visit.startTime + ':00',
      horaFinCalculada: this.addMinutesToTime(visit.startTime, visit.duration) + ':00'
    }));

  if (!visitasModificadas.length) {
    this.showToastMessage('Sin cambios', 'No se detectaron visitas modificadas.', 'warning');
    this.editMode = false;
    return;
  }

  this.isLoading = true;
  this.loadingProgress = 10;
  this.loadingProgressText = 'Actualizando visitas modificadas...';

  const updateRequests = visitasModificadas
    .filter(visit => visit.id !== undefined)
    .map((visit) =>
      this.visitsService.updateVisit(visit.id as number, {
        enfermeraId: visit.enfermeraId,
        horaInicioCalculada: visit.horaInicioCalculada,
        horaFinCalculada: visit.horaFinCalculada
      }).pipe(
        catchError((error) => {
          console.error('Error al actualizar visita:', error);
          this.showToastMessage('Error', `Error al actualizar visita con ID ${visit.id}.`, 'error');
          return of(null);
        })
      )
    );

  forkJoin(updateRequests).subscribe({
    next: (results) => {
      const actualizadas = results.filter(r => r !== null).length;

      this.showToastMessage('Visitas actualizadas', `Se actualizaron ${actualizadas} visitas.`, 'success');

      // Actualiza valores originales
      this.visits.forEach((visit) => {
        visit.originalNurseId = visit.nurseId;
        visit.isOptimizedSuggestion = false;
      });

      this.isLoading = false;
      this.editMode = false;
    },
    error: (error) => {
      console.error('Error al actualizar visitas:', error);
      this.showToastMessage('Error', 'Hubo un problema al actualizar las visitas.', 'error');
      this.isLoading = false;
    }
  });
}

  get visitasSonNuevas(): boolean {
   return this.visits.every(v => !v.id);
  }

  get visitasYaGuardadas(): boolean {
    return this.visits.some(v => !!v.id);
  }


}