import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PatientService } from './../../service/patient.service';
import { AuthService } from 'src/app/service/auth.service';
import { StockService } from 'src/app/service/stock.service'; // 👈 Agregado


interface Localidad {
  codigo: string;
  nombre: string;
}

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {
  @Output() pacienteRegistrado = new EventEmitter<any>();
  showAddressModal = false;
  addressForm!: FormGroup;
  patientForm!: FormGroup;
  tiposIdentificacion: any[] = [];
  tiposActividad: any[] = [];

  listaProcedimientos: any[] = [];
  listaMedicamentos: any[] = [];

  localidades: { codigo: string, nombre: string }[] = [];
  barriosFiltrados: { id: number; nombre: string }[] = [];
  

  frecuencias: number[] = [72, 48, 24, 12, 8, 6];
  duraciones: number[] = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.initPatientForm();
    this.initAddressForm();
    this.agregarMedicamento();
    this.cargarTiposIdentificacion();
    this.cargarTiposActividad();
    this.cargarProcedimientos();
    this.cargarTratamientos();
    this.cargarLocalidades(); 
  }

  initPatientForm() {
    this.patientForm = this.fb.group({
      personalInfo: this.fb.group({
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        tipoDocumento: ['', Validators.required],
        numeroDocumento: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        direccion: ['', Validators.required],
        celular: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        localidad: ['', Validators.required],
        barrio: ['', Validators.required],
        conjunto: [''],
        estado: ['Activo'],
        nombreFamiliar: ['', Validators.required],
        celularFamiliar: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        segundoCelular: ['', Validators.pattern(/^\d+$/)]
      }),
      tratamiento: this.fb.array([]),
      procedimientos: this.fb.array([])
    });
  }

  initAddressForm() {
    this.addressForm = this.fb.group({
      tipoVia: ['', Validators.required],
      numeroVia: ['', Validators.required],
      letraVia: [''],
      bis: [''],
      complemento: [''],
      numeroPlaca: ['', Validators.required],
      localidad: ['', Validators.required],
      barrio: ['', Validators.required],
      complementoDireccion: [''],
      conjunto: ['']
    });
  }

  openAddressModal() {
    this.showAddressModal = true;
  }

  closeAddressModal() {
    this.showAddressModal = false;
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
    const codigo = this.addressForm.get('localidad')?.value || this.patientForm.get('personalInfo.localidad')?.value;

  
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

      this.patientForm.get('personalInfo.direccion')?.setValue(direccionCompleta);
      this.patientForm.get('personalInfo.localidad')?.setValue(address.localidad);
      this.patientForm.get('personalInfo.barrio')?.setValue(address.barrio);
      this.patientForm.get('personalInfo.conjunto')?.setValue(address.conjunto || '');
      this.closeAddressModal();
    } else {
      alert('Por favor complete todos los campos obligatorios de la dirección.');
    }
  }

  get tratamiento(): FormArray<FormGroup> {
    return this.patientForm.get('tratamiento') as FormArray<FormGroup>;
  }

  get procedimientos(): FormArray<FormGroup> {
    return this.patientForm.get('procedimientos') as FormArray<FormGroup>;
  }

  agregarMedicamento() {
    const medicamentoForm = this.fb.group({
      medicamento: ['', Validators.required],
      dosis: ['', [Validators.required, Validators.min(1)]],
      frecuencia: ['', Validators.required],
      diasTratamiento: [{ value: '', disabled: true }],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      horaInicio: ['', Validators.required],
      duracion: ['', Validators.required]
    });

    medicamentoForm.get('fechaInicio')?.valueChanges.subscribe(() => this.calcularDiasTratamiento(medicamentoForm));
    medicamentoForm.get('fechaFin')?.valueChanges.subscribe(() => this.calcularDiasTratamiento(medicamentoForm));

    this.tratamiento.push(medicamentoForm);
  }

  agregarProcedimiento() {
    const procedimientoForm = this.fb.group({
      procedimiento: ['', Validators.required],
      frecuencia: ['',],
      diasTratamiento: [''],
      fechaInicio: ['', Validators.required],
      fechaFin: ['' ],
      horaInicio: [''],
      duracion: ['', Validators.required]
    });

    this.procedimientos.push(procedimientoForm);
  }

  eliminarMedicamento(index: number) {
    this.tratamiento.removeAt(index);
  }

  eliminarProcedimiento(index: number) {
    this.procedimientos.removeAt(index);
  }

  guardarPaciente() {
    if (this.patientForm.invalid) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }
  
    const personalInfo = this.patientForm.get('personalInfo')?.value;
    const tipoTratamiento = this.tiposActividad.find(t => t.name.toUpperCase() === 'MEDICAMENTO');
    const tipoProcedimiento = this.tiposActividad.find(t => t.name.toUpperCase() === 'PROCEDIMIENTO');
  
    if (!tipoTratamiento || !tipoProcedimiento) {
      alert('No se encontraron los tipos de actividad necesarios.');
      return;
    }
  
    const actividades: any[] = [];
  
    this.tratamiento.controls.forEach(trat => {
      const t = trat.value;
      actividades.push({
        actividad: { id: Number(t.medicamento) },
        tipoActividad: { id: tipoTratamiento.id },
        dosis: Number(t.dosis),
        frecuencia: Number(t.frecuencia),
        diasTratamiento: Number(t.diasTratamiento),
        fechaInicio: t.fechaInicio,
        fechaFin: t.fechaFin,
        hora: t.horaInicio
      });
    });
  
    this.procedimientos.controls.forEach(proc => {
      const p = proc.value;
      actividades.push({
        actividad: { id: Number(p.procedimiento) },
        tipoActividad: { id: tipoProcedimiento.id },
        dosis: null,
        frecuencia: Number(p.frecuencia) || null,
        diasTratamiento: null,
        fechaInicio: p.fechaInicio,
        fechaFin: null,
        hora: p.horaInicio
      });
    });
  
    const pacienteData = {
      nombre: personalInfo.nombres,
      apellido: personalInfo.apellidos,
      numero_identificacion: personalInfo.numeroDocumento,
      direccion: personalInfo.direccion,
      telefono: personalInfo.celular,
      barrio: personalInfo.barrio,
      conjunto: personalInfo.conjunto || '',
      latitud: '',
      longitud: '',
      localidad: personalInfo.localidad,
      nombre_acudiente: personalInfo.nombreFamiliar,
      telefono_acudiente: personalInfo.celularFamiliar,
      telefono_acudiente2: personalInfo.segundoCelular,
      estado: personalInfo.estado,
      tipoIdentificacion: {
        id: Number(personalInfo.tipoDocumento)
      },
      actividades: actividades
    };
  
    this.patientService.registrarPaciente(pacienteData).subscribe({
      next: () => {
        alert('Paciente registrado con éxito');
        this.patientForm.reset();
      },
      error: (err) => {
        console.error('Error al registrar paciente:', err);
        alert('Error al registrar paciente');
      }
    });
  }
  

  calcularDiasTratamiento(medicamentoForm: FormGroup) {
    const fechaInicio = medicamentoForm.get('fechaInicio')?.value;
    const fechaFin = medicamentoForm.get('fechaFin')?.value;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      if (inicio <= fin) {
        const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
        medicamentoForm.get('diasTratamiento')?.setValue(dias);
      } else {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
        medicamentoForm.get('diasTratamiento')?.setValue(0);
      }
    }
  }

  cargarTiposActividad() {
    this.patientService.getTiposActividad().subscribe({
      next: tipos => this.tiposActividad = tipos,
      error: err => console.error('Error cargando tipos de actividad', err)
    });
  }

  cargarTiposIdentificacion() {
    this.patientService.getTiposIdentificacion().subscribe({
      next: tipos => this.tiposIdentificacion = tipos,
      error: err => console.error('Error al cargar tipos de identificación', err)
    });
  }

  cargarProcedimientos() {
    this.stockService.getListaMedicamentos().subscribe({
      next: (actividades: any[]) => {
        this.listaProcedimientos = actividades.filter(
          a =>
            a.tipoActividad?.name?.toUpperCase() === 'PROCEDIMIENTO' &&
            a.estado?.toUpperCase() === 'ACTIVO'
        );
        console.log('Procedimientos cargados:', this.listaProcedimientos);
      },
      error: (err) => {
        console.error('Error al cargar procedimientos:', err);
      }
    });
  }

  cargarTratamientos(){
    this.stockService.getListaMedicamentos().subscribe({
      next: (actividades: any[]) => {
        this.listaMedicamentos = actividades.filter(
          a =>
            a.tipoActividad?.name?.toUpperCase() === 'MEDICAMENTO' &&
            a.estado?.toUpperCase() === 'ACTIVO'
        );
        console.log('Tratamientos cargados:', this.listaMedicamentos);
      },
      error: (err) => {
        console.error('Error al cargar tratamientos:', err);
      }
    });
  }
  
}
