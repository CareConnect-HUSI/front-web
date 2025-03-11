import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NurseService } from 'src/app/service/nurse.service';

@Component({
  selector: 'app-lista-enfermeras',
  templateUrl: './lista-enfermeras.component.html',
  styleUrls: ['./lista-enfermeras.component.css']
})
export class ListaEnfermerasComponent implements OnInit {
  tiposEnfermeras = ["Enfermeras en turno", "Turno mañana", "Turno tarde", "Turno noche"];
  tipoSeleccionado = "Enfermeras en turno";
  mostrarDropdown = false;
  enfermeras: any[] = []; // Asegurar que sea un array
  enfermeraSeleccionada: any = null;

  constructor(private router: Router, private nurseService: NurseService) {}

  ngOnInit(): void {
    this.nurseService.findAll().subscribe({
      next: (data) => {
        console.log('✅ Enfermeras cargadas:', data);
        this.enfermeras = data; // Ahora sí es un array
      },
      error: (error) => {
        console.error('❌ Error cargando enfermeras:', error);
      }
    });
  }

  seleccionarEnfermera(enfermera: any) {
    this.enfermeraSeleccionada = enfermera;
    this.router.navigate(['/nurses-assignment', enfermera.id]); // Redirige a la ruta con el ID
  }

  cambiarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.mostrarDropdown = false;
  }

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }
}
