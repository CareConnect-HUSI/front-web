import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  documentoPaciente: string | null = '';
  nombrePaciente: string = '';
  inventario: any[] = [];

  pacientes = [
    {
      documento: '12345678910',
      nombre: 'Juan Pablo Rodríguez',
      inventario: [
        { nombre: 'Acetaminofén', dosis: '1 GR', via: 'VO', frecuencia: 'C/8 HR', cantidad: 18, usado: 12 },
        { nombre: 'Hidromorfona', dosis: '0.3 MG', via: 'SC', frecuencia: 'C/4 HR', cantidad: 12, usado: 12 }
      ]
    },
    {
      documento: '98765432110',
      nombre: 'María Fernanda López',
      inventario: [
        { nombre: 'Omeprazol', dosis: '20 MG', via: 'VO', frecuencia: 'C/DIA', cantidad: 3, usado: 2 }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.documentoPaciente = this.route.snapshot.paramMap.get('documento');
    const paciente = this.pacientes.find(p => p.documento === this.documentoPaciente);
    if (paciente) {
      this.nombrePaciente = paciente.nombre;
      this.inventario = paciente.inventario.map(item => {
        return {
          ...item,
          calendario: this.generarCalendario(item.usado)
        };
      });
    } else {
      console.log('Paciente no encontrado');
    }
  }

  generarCalendario(usado: number): any[] {
    const calendario = Array(7).fill({ M: '', T: '', N: '' });
    for (let i = 0; i < usado; i++) {
      const dia = Math.floor(Math.random() * 7);
      const hora = ['M', 'T', 'N'][Math.floor(Math.random() * 3)];
      calendario[dia][hora] = 'X'; // 'X' indica que el medicamento fue aplicado
    }
    return calendario;
  }
}