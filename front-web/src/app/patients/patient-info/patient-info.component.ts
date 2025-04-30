import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit {
  showEditModal = false;
  paciente: any = {}; 
  treatment: any[] = [];
  historial: any[] = [];

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPatient(id);
    }
  }

  loadPatient(id: number) {
    this.patientService.obtenerPacientePorId(id).subscribe({
      next: (data) => {
        console.log('Paciente cargado:', data);
  
        if (!data) {
          console.error('Paciente no encontrado');
          return;
        }
  
        this.paciente = {
          nombres: data.nombre,
          apellidos: data.apellido,
          documento: data.numero_identificacion,
          direccion: data.direccion,
          localidad: data.localidad,
          barrio: data.barrio,
          celular: data.telefono,
          nombreFamiliar: data.nombre_acudiente,
          celularFamiliar: data.telefono_acudiente,
          segundoCelularFamiliar: data.segundo_telefono_acudiente,
          estado: data.estado
        };
  
        if (data.actividades) {
          this.treatment = data.actividades.map((actividad: any) => ({
            nombre: actividad.nombreActividad,
            cantidad: actividad.dosis + ' mg',
            dias: actividad.diasTratamiento,
            posologia: actividad.frecuencia + ' veces al día',
            fechaInicio: actividad.fechaInicio
          }));
          
  
          this.historial = this.treatment.map((t: any) => ({
            tratamiento: t.nombre,
            dias: t.dias,
            completado: false
          }));
        }
      },
      error: (err) => {
        console.error('Error al cargar paciente', err);
      }
    });
  }
  
  

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
}
