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
    { documento: '12345678910', nombre: 'Juan Pablo Rodríguez', inventario: [
        { nombre: 'Inyección insulina', cantidad: 3, usado: 1 },
        { nombre: 'Inyección insulina', cantidad: 3, usado: 3 },
        { nombre: 'Inyección insulina', cantidad: 3, usado: 3 },
        { nombre: 'Inyección insulina', cantidad: 3, usado: 2 },
        { nombre: 'Inyección insulina', cantidad: 3, usado: 1 }
      ] 
    },
    { documento: '98765432110', nombre: 'María Fernanda López', inventario: [
        { nombre: 'Paracetamol', cantidad: 10, usado: 2 },
        { nombre: 'Amoxicilina', cantidad: 7, usado: 1 }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.documentoPaciente = this.route.snapshot.paramMap.get('documento');

    const paciente = this.pacientes.find(p => p.documento === this.documentoPaciente);

    if (paciente) {
      this.nombrePaciente = paciente.nombre;
      this.inventario = paciente.inventario;
    } else {
      console.log('Paciente no encontrado');
    }
  }
}
