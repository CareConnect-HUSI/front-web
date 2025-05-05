import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css'],
})
export class PatientInfoComponent implements OnInit {
  showEditModal = false;
  paciente: any = {};
  treatment: any[] = [];
  historial: any[] = [];
  pacienteId!: number;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pacienteId = id;
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

        this.pacienteId = data.id;

        const tipoId = data.tipoIdentificacion ?? {};
        const nombreTipo = tipoId.nombre || tipoId.name || 'CC';

        this.paciente = {
          id: data.id,
          nombres: data.nombre,
          apellidos: data.apellido,
          direccion: data.direccion,
          celular: data.telefono,
          documento: data.numeroIdentificacion,
          nombreFamiliar: data.nombreAcudiente,
          celularFamiliar: data.telefonoAcudiente,
          segundoCelularFamiliar: data.telefonoAcudiente2,
          barrio: data.barrio,
          conjunto: data.conjunto,
          localidad: data.localidad,
          estado: data.estado,
          tipoIdentificacion: {
            id: tipoId.id,
            nombre: nombreTipo,
          },
        };

        if (data.actividades) {
          this.treatment = data.actividades.map((actividad: any) => ({
            nombre: actividad.nombreActividad,
            cantidad: `${actividad.dosis} mg`,
            dias: actividad.diasTratamiento,
            posologia: `${actividad.frecuencia} veces al día`,
            fechaInicio: actividad.fechaInicio,
          }));

          this.historial = this.treatment.map((t: any) => ({
            tratamiento: t.nombre,
            dias: t.dias,
            completado: false,
          }));
        }
      },
      error: (err) => {
        console.error('Error al cargar paciente', err);
      },
    });
  }

  verInventario(paciente: any) {
    this.router.navigate(['/inventario-paciente', paciente.id]);
  }

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveChanges() {
    if (!this.paciente.documento || this.paciente.documento.trim() === '') {
      alert('Error: El número de identificación no puede estar vacío.');
      return;
    }
  
    const payload = {
      id: this.paciente.id,
      nombre: this.paciente.nombres,
      apellido: this.paciente.apellidos,
      direccion: this.paciente.direccion,
      telefono: this.paciente.celular,
      numero_identificacion: this.paciente.documento,
      nombre_acudiente: this.paciente.nombreFamiliar,
      telefono_acudiente: this.paciente.celularFamiliar,
      telefono_acudiente2: this.paciente.segundoCelularFamiliar,
      barrio: this.paciente.barrio,
      conjunto: this.paciente.conjunto,
      localidad: this.paciente.localidad,
      estado: this.paciente.estado,
      tipoIdentificacion: {
        id: this.paciente.tipoIdentificacion?.id,
        nombre: this.paciente.tipoIdentificacion?.nombre,
      },
    };
  
    console.log('Payload final:', payload);
  
    this.patientService.updatePaciente(this.pacienteId, payload).subscribe({
      next: (response) => {
        console.log('Paciente actualizado:', response);
        alert('Datos guardados correctamente');
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Error al actualizar el paciente:', error);
        alert('Error al actualizar el paciente');
      },
    });
  }  
}
