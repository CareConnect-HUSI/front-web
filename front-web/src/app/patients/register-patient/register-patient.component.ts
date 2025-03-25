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

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {
  @Output() pacienteRegistrado = new EventEmitter<any>();

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
    const personalInfo = this.patientForm.get('personalInfo')?.value;
    const nuevoPaciente = {
      documento: personalInfo.numeroDocumento,
      nombre: `${personalInfo.nombres} ${personalInfo.apellidos}`,
      recienAgregado: true
    };

    if (nuevoPaciente.documento && nuevoPaciente.nombre) {
      this.pacienteRegistrado.emit(nuevoPaciente);
      this.patientForm.reset();
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}