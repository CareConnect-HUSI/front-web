import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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
    // Validar que los campos no estén vacíos
    if (this.nuevoPaciente.documento && this.nuevoPaciente.nombre) {
      this.pacienteRegistrado.emit(this.nuevoPaciente);
      this.nuevoPaciente = { documento: '', nombre: '' }; // Limpiar el formulario
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

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.patientForm = this.fb.group({
      personalInfo: this.fb.group({
        name: ['Juan Pablo'],
        apellidos: ['Rodríguez Cruz'],
        tipoDocumento: ['CC'],
        numeroDocumento: ['1000200'],
        direccion: ['Calle 123 #0-23'],
        celular: ['3088765987'],
        localidad: ['Suba'],
        barrio: [''],
        nombreFamiliar: ['Mateo Lopez'],
        parentesco: ['Hermano'],
        email: ['correo@gmail.com'],
        password:['123456'],
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
    this.authService.registerPatient(this.patientForm.value).subscribe(
      () => alert('Paciente registrado con éxito'),
      () => alert('Error en el registro')
    );
  }
  
}
