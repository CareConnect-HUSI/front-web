import { AuthService } from 'src/app/service/auth.service';
import { NurseService } from 'src/app/service/nurse.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from 'src/app/service/patient.service';

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

  localidades: { codigo: string, nombre: string }[] = [];
  barriosFiltrados: { id: number; nombre: string }[] = [];


  showForm = false;
  isEditMode = false;
  currentNurseId: number | null = null;
  nurses: any[] = [];
  tiposIdentificacion: any[] = [];
  currentPage = 0;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private nurseService: NurseService
  ) {}

  ngOnInit() {
    this.cargarTiposIdentificacion();
    this.initNurseForm();
    this.initAddressForm();
    this.loadNurses();
    this.cargarLocalidades(); 
  }

  cargarLocalidades() {
    this.nurseService.getLocalidades().subscribe({
      next: (localidades: Localidad[]) => {
        this.localidades = localidades.map(l => ({ codigo: l.codigo, nombre: l.nombre }));
      },
      error: (error) => {
        console.error('Error al cargar localidades:', error);
      }
    });
  }

  onLocalidadChange() {
    const codigo = this.addressForm.get('localidad')?.value || this.nurseForm.get('localidad')?.value;
  
    if (!codigo) return;
  
    this.nurseService.getBarriosPorLocalidad(codigo).subscribe({
      next: (barrios: any[]) => {
        this.barriosFiltrados = barrios.map(b => ({ id: b.id, nombre: b.nombre }));
      },
      error: (err: any) => {
        console.error('Error al cargar barrios:', err);
      }
    });
  }
  

  initNurseForm() {
    this.nurseForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      identificationType: ['CC', Validators.required],
      identificationNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      localidad: ['', Validators.required],
      barrio: ['', Validators.required],
      turno: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      estado: ['Activo'],
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
    const currentLocalidad = this.nurseForm.get('localidad')?.value;
    const currentBarrio = this.nurseForm.get('barrio')?.value;

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

  saveAddress() {
    if (this.addressForm.valid) {
      const address = this.addressForm.value;
      let direccionCompleta = `${address.tipoVia} ${address.numeroVia}`;
      if (address.letraVia) direccionCompleta += ` ${address.letraVia}`;
      if (address.bis) direccionCompleta += ` ${address.bis}`;
      if (address.complemento) direccionCompleta += ` ${address.complemento}`;
      direccionCompleta += ` # ${address.numeroPlaca}`;
      if (address.complementoDireccion) direccionCompleta += `, ${address.complementoDireccion}`;

      this.nurseForm.get('address')?.setValue(direccionCompleta);
      this.nurseForm.get('localidad')?.setValue(address.localidad);
      this.nurseForm.get('barrio')?.setValue(address.barrio);

      this.closeAddressModal();
    }
  }

  cargarTiposIdentificacion() {
    this.nurseService.getTiposIdentificacion().subscribe({
      next: tipos => this.tiposIdentificacion = tipos,
      error: err => console.error('Error al cargar tipos de identificación', err)
    });
  }
  
  onSubmit() {
    if (this.nurseForm.invalid) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }

    const formValues = this.nurseForm.value;
    const localidadNombre = this.localidades.find(l => l.codigo === formValues.localidad)?.nombre || formValues.localidad;

    const userData = {
      nombre: formValues.name,
      apellido: formValues.lastname,
      numeroIdentificacion: formValues.identificationNumber,
      direccion: formValues.address,
      telefono: formValues.phone,
      barrio: formValues.barrio,
      conjunto: '',
      localidad: localidadNombre,
      email: formValues.email,
      password: formValues.password !== '********' ? formValues.password : undefined,
      tipoIdentificacion: { name: formValues.identificationType },
      turnoEntity: { name: formValues.turno },
      latitud: '',
      longitud: ''
    };

    console.log('Datos del formulario:', this.nurseForm.value);
    console.log('Datos del usuario:', userData);

    if (this.isEditMode && this.currentNurseId) {
      this.nurseService.updateEnfermera(this.currentNurseId, userData).subscribe({
        next: () => {
          alert('Enfermera actualizada con éxito');
          this.loadNurses();
          this.showForm = false;
        },
        error: (error) => this.handleError(error)
      });
    } else {
      this.nurseService.registrarEnfermera(userData).subscribe({
        next: () => {
          alert('Enfermera registrada con éxito');
          this.nurseForm.reset();
          this.loadNurses();
          this.showForm = false;
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  private handleError(error: any) {
    if (error.status === 400) {
      alert('Error: ' + error.error.error);
    } else {
      alert('Ocurrió un error en el registro');
    }
    console.error('Error del backend:', error);
  }

  loadNurses() {
    this.nurseService.findAll(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.nurses = response.content || response;
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

  // Buscar código de localidad a partir del barrio actual
  this.nurseService.getLocalidades().subscribe({
    next: (localidades: any[]) => {
      this.localidades = localidades;

      this.nurseService.getBarriosPorNombre(nurse.barrio).subscribe({
        next: (barrioData: any) => {
          const localidadCodigo = barrioData.localidad?.codigo || '';

          this.nurseForm.patchValue({
            name: nurse.nombre,
            lastname: nurse.apellido,
            identificationType: nurse.tipoIdentificacion?.name || 'CC',
            identificationNumber: nurse.numeroIdentificacion,
            address: nurse.direccion,
            phone: nurse.telefono,
            localidad: localidadCodigo,
            barrio: nurse.barrio,
            turno: nurse.turnoEntity?.name || '',
            email: nurse.email,
            password: '********'
          });

          this.onLocalidadChange();
        },
        error: (err: any) => {
          console.warn('No se pudo obtener localidad del barrio:', err);
        }
      });
    },
    error: err => {
      console.error('Error al cargar localidades:', err);
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
