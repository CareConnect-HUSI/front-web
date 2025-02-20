import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {
  patientForm!: FormGroup;
  nuevoMedicamento!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.patientForm = this.fb.group({
      personalInfo: this.fb.group({
        nombres: ['Juan Pablo'],
        apellidos: ['Rodríguez Cruz'],
        tipoDocumento: ['CC'],
        numeroDocumento: ['1000200'],
        direccion: ['Calle 123 #0-23'],
        celular: ['3088765987'],
        localidad: ['Suba'],
        barrio: [''],
        nombreFamiliar: ['Mateo Lopez'],
        parentesco: ['Hermano'],
        foto: [null]
      }),
      tratamiento: this.fb.array([])
    });
    this.agregarMedicamento();
  }

  get tratamiento(): FormArray<FormGroup> {
    return this.patientForm.get('tratamiento') as FormArray<FormGroup>;
  }
  
   

  agregarMedicamento() {
    const medicamentoForm = this.fb.group({
      medicamento: [''],
      cantidad: [''],
      diasTratamiento: [''],
      posologia: [''],
      fechaInicio: ['']
    });
  
    this.tratamiento.push(medicamentoForm);
  }
  
  eliminarMedicamento(index: number) {
    if (this.tratamiento.length > 1) {
      this.tratamiento.removeAt(index);
    } else {
      alert('Debe haber al menos un medicamento en el tratamiento.');
    }
  }
  
  onSubmit() {
    console.log('Datos del Paciente:', this.patientForm.value);
    alert('Paciente registrado con éxito');
  }
}
