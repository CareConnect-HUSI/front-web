import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PatientService } from './../../service/patient.service';
import { AuthService } from 'src/app/service/auth.service';

interface Medicamento {
  codigo: string;
  nombre: string;
  tipo: string; // Oral o Inyectable
  total: number;
}

interface Procedimiento {
  codigo: string;
  abreviatura: string;
  descripcion: string;
}
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


  listaProcedimientos: Procedimiento[] = [
    { codigo: '1', abreviatura: 'CUR', descripcion: 'Curación' },
    { codigo: '2', abreviatura: 'HEM', descripcion: 'Hemocultivo' },
    { codigo: '3', abreviatura: 'CAT', descripcion: 'Curación de Cateter' },
  ];

  listaMedicamentos: Medicamento[] = [
    { codigo: '1', nombre: 'Paracetamol 500 mg', tipo: 'Oral', total: 100 },
    { codigo: '2', nombre: 'Ibuprofeno 120 mg', tipo: 'Oral', total: 50 },
    { codigo: '3', nombre: 'Amoxicilina 100 ml', tipo: 'Inyectable', total: 30 },
  ];
  // Datos DIVIPOLA para Bogotá
  localidades: Localidad[] = [
    { codigo: '1', nombre: 'Usaquén' },
    { codigo: '2', nombre: 'Chapinero' },
    { codigo: '3', nombre: 'Santa Fe' },
    { codigo: '4', nombre: 'San Cristóbal' },
    { codigo: '5', nombre: 'Usme' },
    { codigo: '6', nombre: 'Tunjuelito' },
    { codigo: '7', nombre: 'Bosa' },
    { codigo: '8', nombre: 'Kennedy' },
    { codigo: '9', nombre: 'Fontibón' },
    { codigo: '10', nombre: 'Engativá' },
    { codigo: '11', nombre: 'Suba' },
    { codigo: '12', nombre: 'Barrios Unidos' },
    { codigo: '13', nombre: 'Teusaquillo' },
    { codigo: '14', nombre: 'Los Mártires' },
    { codigo: '15', nombre: 'Antonio Nariño' },
    { codigo: '16', nombre: 'Puente Aranda' },
    { codigo: '17', nombre: 'La Candelaria' },
    { codigo: '18', nombre: 'Rafael Uribe Uribe' },
    { codigo: '19', nombre: 'Ciudad Bolívar' },
    { codigo: '20', nombre: 'Sumapaz' }
  ];

  barriosPorLocalidad: {[key: string]: string[]} = {
    '1': ['Santa Bárbara', 'Cedritos', 'Toberín', 'Usaquén', 'Calle 170'],
    '2': ['Chapinero', 'El Lago', 'La Salle', 'Rosales', 'Quinta Camacho'],
    // Agrega los barrios para cada localidad
  };

  barriosFiltrados: string[] = [];

  frecuencias: number[] = [72, 48, 24, 12, 8, 6];
  duraciones: number[] = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

  constructor(private fb: FormBuilder, private patientService: PatientService) {}


  ngOnInit() {
    this.initPatientForm();
    this.initAddressForm();
    this.agregarMedicamento();
    this.cargarTiposIdentificacion();
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
        nombreFamiliar: ['', Validators.required],
        celularFamiliar: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        segundoCelular: ['', Validators.required]
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

  onLocalidadChange() {
    const localidadCod = this.addressForm.get('localidad')?.value;
    this.barriosFiltrados = this.barriosPorLocalidad[localidadCod] || [];
    this.addressForm.get('barrio')?.reset();
  }

  saveAddress() {
    if (this.addressForm.valid) {
      const address = this.addressForm.value;
  
      // Construir dirección en formato estándar colombiano
      let direccionCompleta = `${address.tipoVia} ${address.numeroVia}`;
  
      if (address.letraVia?.trim()) direccionCompleta += ` ${address.letraVia}`;
      if (address.bis?.trim()) direccionCompleta += ` ${address.bis}`;
      if (address.complemento?.trim()) direccionCompleta += ` ${address.complemento}`;
  
      direccionCompleta += ` # ${address.numeroPlaca}`;
  
      if (address.complementoDireccion?.trim()) {
        direccionCompleta += `, ${address.complementoDireccion}`;
      }
  
      if (address.conjunto?.trim()) {
        direccionCompleta += `, Conjunto ${address.conjunto}`;
      }
  
      // Agregar ciudad y país explícitamente para mejorar la geocodificación
      direccionCompleta += `, Bogotá, Colombia`;
  
      // Actualizar el formulario principal
      this.patientForm.get('personalInfo.direccion')?.setValue(direccionCompleta);
      this.patientForm.get('personalInfo.localidad')?.setValue(
        this.localidades.find(l => l.codigo === address.localidad)?.nombre
      );
      this.patientForm.get('personalInfo.barrio')?.setValue(address.barrio);
  
      // Si tienes un campo conjunto también en el formulario principal
      this.patientForm.get('personalInfo.conjunto')?.setValue(address.conjunto || '');
  
      this.closeAddressModal();
  
      // Opcional para depuración
      console.log('Dirección enviada al backend:', direccionCompleta);
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
      dosis: ['', Validators.required],
      frecuencia: ['', Validators.required],
      diasTratamiento: [{value: '', disabled: true}],
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
      frecuencia: ['', Validators.required],
      diasTratamiento: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      horaInicio: ['', Validators.required],
      duracion: ['', Validators.required]
    });

    this.procedimientos.push(procedimientoForm);
  }

  eliminarMedicamento(index: number) {
    if (this.tratamiento.length > 1) {
      this.tratamiento.removeAt(index);
    } else {
      alert('Debe haber al menos un medicamento en el tratamiento.');
    }
  }

  eliminarProcedimiento(index: number) {
    if (this.procedimientos.length > 1) {
      this.procedimientos.removeAt(index);
    } else {
      alert('Debe haber al menos un procedimiento.');
    }
  }

  guardarPaciente() {
    if (this.patientForm.invalid) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }
  
    const personalInfo = this.patientForm.get('personalInfo')?.value;

    const pacienteData = {
      nombre: personalInfo.nombres,
      apellido: personalInfo.apellidos,
      numero_identificacion: personalInfo.numeroDocumento,
      direccion: personalInfo.direccion,
      telefono: personalInfo.celular,
      barrio: personalInfo.barrio,
      conjunto: personalInfo.conjunto || null,
      localidad: personalInfo.localidad,
      ciudad: 'Bogotá',
      latitud: null,
      longitud: null,
      nombre_acudiente: personalInfo.nombreFamiliar,
      telefono_acudiente: personalInfo.celularFamiliar,
      telefono_acudiente2: personalInfo.segundoCelular,
      parentezco_acudiente: personalInfo.parentesco,
      tipoIdentificacion: {
        id: Number(personalInfo.tipoDocumento)  
      }
    };
  
    this.patientService.registrarPaciente(pacienteData).subscribe({
      next: (res) => {
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
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.')
        medicamentoForm.get('diasTratamiento')?.setValue(0);
      }
    }
  }
  
  cargarTiposIdentificacion() {
    this.patientService.getTiposIdentificacion().subscribe({
      next: (tipos) => {
        this.tiposIdentificacion = tipos;
      },
      error: (err) => {
        console.error('Error al cargar tipos de identificación', err);
      }
    });
  }  
}