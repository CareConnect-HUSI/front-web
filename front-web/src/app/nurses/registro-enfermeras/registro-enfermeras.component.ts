import { AuthService } from 'src/app/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
@Component({
  selector: 'app-registro-enfermeras',
  templateUrl: './registro-enfermeras.component.html',
  styleUrls: ['./registro-enfermeras.component.css']
})
export class RegistroEnfermerasComponent implements OnInit {

  nurseForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService){}

  ngOnInit() {
    this.nurseForm = this.fb.group({
      personalInfo: this.fb.group({
        name: ['Isabel'],
        lastname: ['Rodriguez Trujillo'],
        identificationType: ['CC'],
        identificationNumber: ['1000974657'],
        address: ['Calle 123 #0-23'],
        phone: ['302875676'],
        localidad: ['Suba'],
        turno: ['noche'],
        email: ['correo@gmail.com'],
        password:['123456'],
        foto: [null]
      })
    });
      
  }
  /*onSubmit() {
    this.authService.registerNurse(this.nurseForm.value).subscribe(
      () => alert('Enfermera registrada con éxito'),
      () => alert('Error en el registro')
    );
  }*/

    onSubmit() {
      const formData = this.nurseForm.value.personalInfo;
      console.log("✅ Datos enviados al servicio:", formData);
    
      if (!formData || typeof formData !== "object") {
        console.error("❌ Error: Datos inválidos antes de enviarlos al servicio", formData);
        return;
      }
    
      this.authService.registerNurse(formData).subscribe(
        () => alert('Enfermera registrada con éxito'),
        error => {
          alert('Error en el registro');
          console.error("❌ Error del backend:", error);
        }
      );
    }
    
    
    
    
  
}
