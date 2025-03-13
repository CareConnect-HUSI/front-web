import { AuthService } from 'src/app/service/auth.service';
import { NurseService } from 'src/app/service/nurse.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-enfermeras',
  templateUrl: './registro-enfermeras.component.html',
  styleUrls: ['./registro-enfermeras.component.css']
})
export class RegistroEnfermerasComponent implements OnInit {

  nurseForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private nurseService: NurseService
  ) {}

  ngOnInit() {
    this.nurseForm = this.fb.group({
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        identificationType: ['CC', Validators.required],
        identificationNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        address: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        localidad: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        foto: [null]
      })
    });
  }

  onSubmit() {
    if (this.nurseForm.invalid) {
      alert('Todos los campos son obligatorios.');
      return;
    }
  
    const formData = this.nurseForm.value.personalInfo;

  
    this.authService.registerNurse(formData).subscribe({
      next: () => {
        alert('Enfermera registrada con éxito');
        this.nurseForm.reset();
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
