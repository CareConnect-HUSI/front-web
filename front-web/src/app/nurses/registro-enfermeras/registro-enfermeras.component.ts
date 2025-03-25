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
  imagePreview: string | ArrayBuffer | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService
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
        turno: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password:  ['', [Validators.required, Validators.minLength(6)]],
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
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.nurseForm.get('personalInfo.foto')?.setValue(file);
      
      // Vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.querySelector('[formControlName="password"]') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }
}
