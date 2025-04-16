import { AuthService } from 'src/app/service/auth.service';
import { NurseService } from 'src/app/service/nurse.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Localidad {
  codigo: string;
  nombre: string;
}

@Component({
  selector: 'app-registro-enfermeras',
  templateUrl: './registro-enfermeras.component.html',
  styleUrls: ['./registro-enfermeras.component.css']
})
export class RegistroEnfermerasComponent implements OnInit {

  nurseForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  showPassword = false;
  showAddressModal = false;
  addressForm!: FormGroup;

  // Datos DIVIPOLA para Bogotá
  localidades: Localidad[] = [
    { codigo: '1', nombre: 'Usaquén' },
    { codigo: '2', nombre: 'Chapinero' },
    // ... completa con todas las localidades
  ];


  barriosPorLocalidad: {[key: string]: string[]} = {
    '1': ['Santa Bárbara', 'Cedritos', 'Toberín', 'Usaquén', 'Calle 170'],
    '2': ['Chapinero', 'El Lago', 'La Salle', 'Rosales', 'Quinta Camacho'],
    // ... completa con los barrios de cada localidad
  };

  barriosFiltrados: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private nurseService: NurseService
  ) {}

  ngOnInit() {
    this.initNurseForm();
    this.initAddressForm();
  }

  initNurseForm() {
    this.nurseForm = this.fb.group({
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        identificationType: ['CC', Validators.required],
        identificationNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        address: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        localidad: ['', Validators.required],
        barrio: ['', Validators.required],
        turno: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        foto: [null]
      })
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
      complementoDireccion: ['']
    });
  }

  openAddressModal() {
    // Si ya hay datos en el formulario principal, cargarlos en el modal
    const currentAddress = this.nurseForm.get('personalInfo.address')?.value;
    const currentLocalidad = this.nurseForm.get('personalInfo.localidad')?.value;
    const currentBarrio = this.nurseForm.get('personalInfo.barrio')?.value;
    
    if (currentAddress) {
      // Aquí podrías implementar lógica para parsear la dirección si es necesario
    }
    
    if (currentLocalidad) {
      this.addressForm.get('localidad')?.setValue(currentLocalidad);
      this.onLocalidadChange();
    }
    
    if (currentBarrio) {
      this.addressForm.get('barrio')?.setValue(currentBarrio);
    }
    
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
      this.nurseForm.get('personalInfo.address')?.setValue(direccionCompleta);
      this.nurseForm.get('personalInfo.localidad')?.setValue(
        this.localidades.find(l => l.codigo === address.localidad)?.nombre
      );
      this.nurseForm.get('personalInfo.barrio')?.setValue(address.barrio);
      
      this.closeAddressModal();
    }
  }

  onSubmit() {
    if (this.nurseForm.invalid) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }
    const formValues = this.nurseForm.get('personalInfo')?.value;

    const userData = {
      nombre: formValues.name,
      apellido: formValues.lastname,
      numeroIdentificacion: formValues.identificationNumber,
      direccion: formValues.address,
      telefono: formValues.phone,
      barrio: formValues.barrio,
      conjunto: "",
      email: formValues.email,
      password: formValues.password,
      latitud: "",
      longitud: "",
      tipoIdentificacion: {
        name: formValues.identificationType
      },
      turnoEntity: {  
        name: formValues.turno
      }
      
    };
  

    
  
    this.nurseService.registrarEnfermera(userData).subscribe({
      next: () => {
        alert('Enfermera registrada con éxito');
        this.nurseForm.reset();
        this.imagePreview = null;
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
