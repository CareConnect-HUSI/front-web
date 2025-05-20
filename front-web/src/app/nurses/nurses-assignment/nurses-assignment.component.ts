import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {VisitsService} from '../../service/visits.service';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-nurses-assignment',
  templateUrl: './nurses-assignment.component.html',
  styleUrls: ['./nurses-assignment.component.css']
})
export class NursesAssignmentComponent implements OnInit {
  enfermeraId: string | null = null;
  enfermeraNombre: string = "Enfermera Desconocida";

  filtroPaciente = '';
  mesSeleccionado = '';
  anioSeleccionado = '';
  fechaEspecifica = '';
  asignacionesFiltradas: any[] = [];
  asignaciones: any[] = [];

 meses = [
    { value: '1', nombre: 'Enero' },
    { value: '2', nombre: 'Febrero' },
    { value: '3', nombre: 'Marzo' },
    { value: '4', nombre: 'Abril' },
    { value: '5', nombre: 'Mayo' },
    { value: '6', nombre: 'Junio' },
    { value: '7', nombre: 'Julio' },
    { value: '8', nombre: 'Agosto' },
    { value: '9', nombre: 'Septiembre' },
    { value: '10', nombre: 'Octubre' },
    { value: '11', nombre: 'Noviembre' },
    { value: '12', nombre: 'Diciembre' }
  ];
  
  anios = ['2023', '2024', '2025'];

  constructor(
    private route: ActivatedRoute,
    private visitaService: VisitsService,
    private pacienteService: PatientService
  ) {}

  ngOnInit() {
    this.enfermeraId = this.route.snapshot.paramMap.get('id');
    this.enfermeraNombre = this.route.snapshot.paramMap.get('nombre') || 'Enfermera Desconocida';

    if (this.enfermeraId) {
      this.visitaService.getVisitasByEnfermeraId(this.enfermeraId).subscribe(visitas => {
        const enrichedData$ = visitas.map(visita =>
        this.visitaService.getActividadVisitaPacienteById(visita.actividadPacienteVisitaId)
          .toPromise()
          .then(async actividad => {
            const paciente = await this.pacienteService.obtenerPacientePorId(actividad.pacienteId).toPromise();

            return {
              ...visita,
              paciente: `${paciente.nombre} ${paciente.apellido}`,
              documento: paciente.numeroIdentificacion,
              direccion: paciente.direccion ?? 'No disponible',
              detalles: `Actividad ${actividad.actividadId}`,
              fecha: new Date(visita.fechaVisita),
              hora: visita.horaInicioEjecutada? this.formatHora(visita.horaInicioCalculada) : '00:00',
              estado: visita.estado ?? 'PROGRAMADA'
            };
          })
      );

        Promise.all(enrichedData$).then(completadas => {
          this.asignaciones = completadas;
          this.asignaciones.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
          this.asignacionesFiltradas = [...this.asignaciones];
        });
      });
    }
  }

  aplicarFiltros() {
    let resultados = [...this.asignaciones];
    const busqueda = this.filtroPaciente.toLowerCase();

    if (this.filtroPaciente) {
      resultados = resultados.filter(a =>
        a.paciente.toLowerCase().includes(busqueda) ||
        a.documento.toString().includes(busqueda)
      );
    }

    if (this.mesSeleccionado) {
      resultados = resultados.filter(a =>
        (a.fecha.getMonth() + 1).toString() === this.mesSeleccionado
      );
    }

    if (this.anioSeleccionado) {
      resultados = resultados.filter(a =>
        a.fecha.getFullYear().toString() === this.anioSeleccionado
      );
    }

    if (this.fechaEspecifica) {
      const fechaSeleccionada = new Date(this.fechaEspecifica);
      resultados = resultados.filter(a =>
        a.fecha.toDateString() === fechaSeleccionada.toDateString()
      );
    }

    this.asignacionesFiltradas = resultados;
  }

  formatHora(time: string): string {
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formatted = ((h + 11) % 12 + 1) + ':' + minute + ' ' + ampm;
    return formatted;
  }

  verDetalles(asignacion: any) {
    
  }
}
