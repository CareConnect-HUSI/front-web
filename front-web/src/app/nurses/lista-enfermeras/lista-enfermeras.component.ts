import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NurseService } from 'src/app/service/nurse.service';

@Component({
  selector: 'app-lista-enfermeras',
  templateUrl: './lista-enfermeras.component.html',
  styleUrls: ['./lista-enfermeras.component.css']
})
export class ListaEnfermerasComponent implements OnInit {

  length = 0;
  pageSize = 4;
  pageIndex = 0;
  tiposEnfermeras = ["Enfermeras en turno", "Turno mañana", "Turno tarde", "Turno noche"];
  tipoSeleccionado = "Enfermeras en turno";
  mostrarDropdown = false;
  enfermeras: any[] = [];
  enfermeraSeleccionada: any = null;

  constructor(private router: Router, private nurseService: NurseService) {}

  ngOnInit(): void {
    this.getEnfermeras(this.pageIndex, this.pageSize);
  }

  getEnfermeras(page: number, limit: number): void {
    this.nurseService.findAll(page, limit).subscribe({
      next: (data) => {
        console.log('Enfermeras cargadas:', data);
        this.enfermeras = data.content || [];
        this.length = data.totalElements || 0;
      },
      error: (error) => {
        console.error('Error cargando enfermeras:', error);
      }
    });
  }

  handlePageEvent(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEnfermeras(this.pageIndex, this.pageSize);
  }

  seleccionarEnfermera(enfermera: any) {
    this.enfermeraSeleccionada = enfermera;
    this.router.navigate(['/nurses-assignment', enfermera.id]);
  }

  cambiarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.mostrarDropdown = false;
  }
  
  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }
}
