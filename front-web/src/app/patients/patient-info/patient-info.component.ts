import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/service/patient.service';

interface Localidad {
  codigo: string;
  nombre: string;
}

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
  showAddressModal = false;
  addressForm!: FormGroup;
  localidades: { codigo: string, nombre: string }[] = [];
  barriosFiltrados: { id: number; nombre: string }[] = [];

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pacienteId = id;
    if (id) {
      this.loadPatient(id);
    }
    this.initAddressForm()
    this.cargarLocalidades(); 
  }

  initAddressForm() {
    this.addressForm = this.fb.group({
      tipoVia: ['', Validators.required],
      numeroVia: ['', Validators.required],
      letraVia: [''],
      bis: [''],
      complemento: [''],
      numeroPlaca: ['', Validators.required],
      conjunto: [''],
      localidad: ['', Validators.required],
      barrio: ['', Validators.required],
      complementoDireccion: ['']
      });
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
            cantidad: actividad.dosis != null ? `${actividad.dosis} mg` : '-',
            dias: actividad.diasTratamiento,
            posologia: actividad.frecuencia != null ? `${actividad.frecuencia} veces al día` : '-',
            fechaInicio: actividad.fechaInicio,
            duracion: actividad.duracionVisita
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
    this.router.navigate(['/treatments', paciente.id]);
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
      duracion: this.paciente.duracion
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
  openAddressModal() {
    this.showAddressModal = true;
  }

  closeAddressModal() {
    this.showAddressModal = false;
  }

  saveAddress() {
  if (this.addressForm.valid) {
    const address = this.addressForm.value;
    let direccionCompleta = `${address.tipoVia} ${address.numeroVia}`;
    if (address.letraVia?.trim()) direccionCompleta += ` ${address.letraVia}`;
    if (address.bis?.trim()) direccionCompleta += ` ${address.bis}`;
    if (address.complemento?.trim()) direccionCompleta += ` ${address.complemento}`;
    direccionCompleta += ` # ${address.numeroPlaca}`;
    if (address.complementoDireccion?.trim()) direccionCompleta += `, ${address.complementoDireccion}`;
    if (address.conjunto?.trim()) direccionCompleta += `, Conjunto ${address.conjunto}`;
    direccionCompleta += `, Bogotá, Colombia`;

    const localidadCodigo = address.localidad;
    const localidadObj = this.localidades.find(l => l.codigo === localidadCodigo);
    const nombreLocalidad = localidadObj?.nombre || localidadCodigo;

    this.paciente.direccion = direccionCompleta;
    this.paciente.localidad = nombreLocalidad;
    this.paciente.barrio = address.barrio;
    this.paciente.conjunto = address.conjunto || '';

    this.closeAddressModal();
  } else {
    alert('Por favor complete todos los campos obligatorios de la dirección.');
  }
}


  cargarLocalidades() {
    this.patientService.getLocalidades().subscribe({
      next: (localidades: Localidad[]) => {
        this.localidades = localidades.map(l => ({ codigo: l.codigo, nombre: l.nombre }));
      },
      error: (error) => {
        console.error('Error al cargar localidades:', error);
      }
    });
  }

  onLocalidadChange() {
    const codigo = this.addressForm.get('localidad')?.value || this.paciente.get('personalInfo.localidad')?.value;

  
    if (!codigo) return;
  
    this.patientService.getBarriosPorLocalidad(codigo).subscribe({
      next: (barrios: any[]) => {
        this.barriosFiltrados = barrios.map(b => ({ id: b.id, nombre: b.nombre }));
      },
      error: (err: any) => {
        console.error('Error al cargar barrios:', err);
      }
    });
  }
}
