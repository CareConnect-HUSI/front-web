
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PatientService } from './../../service/patient.service';
import { AuthService } from 'src/app/service/auth.service';


@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {
  @Output() pacienteRegistrado = new EventEmitter<any>();

  nuevoPaciente = { documento: '', nombre: '' };
  guardarPaciente() {
    const personalInfo = this.patientForm.get('personalInfo')?.value;
    const nuevoPaciente = {
      documento: personalInfo.numeroDocumento,
      nombre: `${personalInfo.nombres} ${personalInfo.apellidos}`, // Cambiado de 'name' a 'nombres'
      recienAgregado: true // Asegurarse de que el paciente se marque como recién agregado
    };
  
    // Validar que los campos no estén vacíos
    if (nuevoPaciente.documento && nuevoPaciente.nombre) {
      this.pacienteRegistrado.emit(nuevoPaciente);
      this.patientForm.reset(); // Limpiar el formulario
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
  
  patientForm!: FormGroup;
  listaProcedimientos: string[] = [
    'Curación',
    'Hemocultivo',
    'Curación de Cateter',
  ];

  constructor(private fb: FormBuilder, private patientService: PatientService) {}

  ngOnInit() {
    this.patientForm = this.fb.group({
      personalInfo: this.fb.group({
        nombres: ['Juan Pablo', Validators.required],
        apellidos: ['Rodríguez Cruz', Validators.required],
        tipoDocumento: ['CC', Validators.required],
        numeroDocumento: ['1000200',Validators.required],
        direccion: ['Calle 123 #0-23', Validators.required],
        celular: ['3088765987', Validators.required],
        localidad: ['Suba', Validators.required],
        barrio: ['', Validators.required],
        nombreFamiliar: ['Mateo Lopez', Validators.required],
        parentesco: ['Hermano', Validators.required],
        celularFamiliar: ['3012345678', Validators.required],
        email: ['correo@gmail.com',Validators.required],
        foto: [null]
      }),
      tratamiento: this.fb.array([]),
      procedimientos: this.fb.array([])
    });
  
    this.agregarMedicamento();
  }

  get tratamiento(): FormArray <FormGroup> {
    return this.patientForm.get('tratamiento') as FormArray<FormGroup>;
  }

  get procedimientos(): FormArray <FormGroup> {
    return this.patientForm.get('procedimientos') as FormArray <FormGroup>;
  }

  agregarMedicamento() {
    const medicamentoForm = this.fb.group({
      medicamento: [''],
      dosis: [''],
      frecuencia: [''],
      diasTratamiento: [''],
      fechaInicio: [''],
      fechaFin: [''],
      duracion: ['']
    });

    this.tratamiento.push(medicamentoForm);
  }

  agregarProcedimiento() {
    const procedimientoForm = this.fb.group({
      procedimiento: [''],
      frecuencia: [''],
      diasTratamiento: [''],
      fechaInicio: [''],
      fechaFin: [''],
      duracion: ['']
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

  onSubmit() {
    if (this.patientForm.invalid) {
      alert('Todos los campos son obligatorios.');
      return;
    }
  
    const formData = this.patientForm.value.personalInfo;

  //
    this.patientService.registerPatient(formData).subscribe({
      next: () => {
        alert('Enfermera registrada con éxito');
        this.patientForm.reset();
      },
      error: (error) => {
        if (error.status === 400) {
          alert('Error: ' + error.error.error);
        } else {
          alert('Ocurrió un error en el registro');
        }
        console.error("Error del backend:", error);
      }
    });
  }  
  
}