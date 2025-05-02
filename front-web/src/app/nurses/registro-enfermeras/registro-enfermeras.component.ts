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

  // Nuevas propiedades para la lista
  showForm = false;
  isEditMode = false;
  currentNurseId: number | null = null;
  nurses: any[] = [];
  currentPage = 0;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private fb: FormBuilder, 
    private nurseService: NurseService
  ) {}

  ngOnInit() {
    this.initNurseForm();
    this.initAddressForm();
    this.loadNurses();
  }

  loadNurses() {
    this.nurseService.findAll(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.nurses = response.content || response; // Adapta según la estructura de tu API
        this.totalItems = response.totalElements || response.length;
      },
      error: (error) => {
        console.error('Error al cargar enfermeras:', error);
      }
    });
  }


  loadNurseForEdit(nurse: any) {
    this.isEditMode = true;
    this.currentNurseId = nurse.id;
    this.showForm = true;
    
    this.nurseForm.patchValue({
      personalInfo: {
        name: nurse.nombre,
        lastname: nurse.apellido,
        identificationType: nurse.tipoIdentificacion?.name || 'CC',
        identificationNumber: nurse.numeroIdentificacion,
        address: nurse.direccion,
        phone: nurse.telefono,
        localidad: nurse.localidad,
        barrio: nurse.barrio,
        turno: nurse.turnoEntity?.name || '',
        email: nurse.email,
        password: '********' // Placeholder para edición
      }
    });
  }

  toggleStatus(nurse: any) {
    const newStatus = !nurse.activo;
    const updateData = { ...nurse, activo: newStatus };
    
    this.nurseService.updateEnfermera(nurse.id, updateData).subscribe({
      next: () => {
        nurse.activo = newStatus;
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);
      }
    });
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
      email: formValues.email,
      password: formValues.password !== '********' ? formValues.password : undefined,
      tipoIdentificacion: {
        name: formValues.identificationType
      },
      turnoEntity: {  
        name: formValues.turno
      }
    };

    if (this.isEditMode && this.currentNurseId) {
      this.nurseService.updateEnfermera(this.currentNurseId, userData).subscribe({
        next: () => {
          alert('Enfermera actualizada con éxito');
          this.loadNurses();
          this.showForm = false;
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.nurseService.registrarEnfermera(userData).subscribe({
        next: () => {
          alert('Enfermera registrada con éxito');
          this.nurseForm.reset();
          this.loadNurses();
          this.showForm = false;
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }


  private handleError(error: any) {
    if (error.status === 400) {
      alert('Error: ' + error.error.error);
    } else {
      alert('Ocurrió un error en el registro');
    }
    console.error("Error del backend:", error);
  }

  // Métodos para paginación
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNurses();
  }
  
  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i);
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.querySelector('[formControlName="password"]') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }
}
