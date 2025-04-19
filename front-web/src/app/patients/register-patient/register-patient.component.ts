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
  listaProcedimientos: Procedimiento[] = [
    { codigo: '1', abreviatura: 'CUR', descripcion: 'Curación' },
    { codigo: '2', abreviatura: 'HEM', descripcion: 'Hemocultivo' },
    { codigo: '3', abreviatura: 'CAT', descripcion: 'Curación de Cateter' },
  ];

  listaMedicamentos: Medicamento[] = [
    { codigo: '1', nombre: 'Paracetamol', tipo: 'Oral', total: 100 },
    { codigo: '2', nombre: 'Ibuprofeno', tipo: 'Oral', total: 50 },
    { codigo: '3', nombre: 'Amoxicilina', tipo: 'Inyectable', total: 30 },
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
    
    this.patientForm = this.fb.group({
      personalInfo: this.fb.group({
        nombres: ['', Validators.required], // Inicializado vacío
        apellidos: ['', Validators.required], // Inicializado vacío
        tipoDocumento: ['', Validators.required], // Inicializado vacío
        numeroDocumento: ['', Validators.required], // Inicializado vacío
        direccion: ['', Validators.required], // Inicializado vacío
        celular: ['', Validators.required], // Inicializado vacío
        localidad: ['', Validators.required], // Inicializado vacío
        barrio: ['', Validators.required], // Inicializado vacío
        nombreFamiliar: ['', Validators.required], // Inicializado vacío
        parentesco: ['', Validators.required], // Inicializado vacío
        celularFamiliar: ['', Validators.required], // Inicializado vacío
        email: ['', [Validators.required, Validators.email]], // Inicializado vacío
        foto: [null]
      }),
      tratamiento: this.fb.array([]),
      procedimientos: this.fb.array([])
    });
  
    this.agregarMedicamento();
    this.initAddressForm();
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
      complementoDireccion: ['']
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
      
      if (address.letraVia) direccionCompleta += ` ${address.letraVia}`;
      if (address.bis) direccionCompleta += ` ${address.bis}`;
      if (address.complemento) direccionCompleta += ` ${address.complemento}`;
      
      direccionCompleta += ` # ${address.numeroPlaca}`;
      
      if (address.complementoDireccion) {
        direccionCompleta += `, ${address.complementoDireccion}`;
      }
      
      // Actualizar el formulario principal
      this.patientForm.get('personalInfo.direccion')?.setValue(direccionCompleta);
      this.patientForm.get('personalInfo.localidad')?.setValue(
        this.localidades.find(l => l.codigo === address.localidad)?.nombre
      );
      this.patientForm.get('personalInfo.barrio')?.setValue(address.barrio);
      
      this.closeAddressModal();
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
      diasTratamiento: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      horaInicio: ['', Validators.required],
      duracion: ['', Validators.required]
    });

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
      conjunto: null,
      localidad: personalInfo.localidad,
      latitud: null,
      longitud: null,
      nombre_acudiente: personalInfo.nombreFamiliar,
      parentezco_acudiente: personalInfo.parentesco,
      telefono_acudiente: personalInfo.celularFamiliar,
      tipoIdentificacion: {
        name: personalInfo.tipoDocumento
      }
    };
  
    this.patientService.registrarPaciente(pacienteData).subscribe({
      next: (res) => {
        console.log('Paciente registrado con éxito:', res);
        alert('Paciente registrado con éxito');
        this.patientForm.reset();
      },
      error: (err) => {
        console.error('Error al registrar paciente:', err);
        alert('Error al registrar paciente');
      }
    });
  }
  
}