import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
@Component({
  selector: 'app-registro-enfermeras',
  templateUrl: './registro-enfermeras.component.html',
  styleUrls: ['./registro-enfermeras.component.css']
})
export class RegistroEnfermerasComponent implements OnInit {

  nurseForm!: FormGroup;

  constructor(private fb: FormBuilder){}

  ngOnInit() {
    this.nurseForm = this.fb.group({
      personalInfo: this.fb.group({
        nombres: ['Isabel'],
        apellidos: ['Rodriguez Trujillo'],
        tipoDocumento: ['CC'],
        numeroDocumento: ['1000974657'],
        direccion: ['Calle 123 #0-23'],
        celular: ['302875676'],
        localidad: ['Suba'],
        turno: ['noche'],
        foto: [null]
      })
    });
      
  }
  onSubmit() {
    console.log('Datos del enfermero o enfermera:', this.nurseForm.value);
    alert('Paciente registrado con éxito');
  }
}
