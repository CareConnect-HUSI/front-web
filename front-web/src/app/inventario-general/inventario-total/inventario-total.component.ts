import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario-total',
  templateUrl: './inventario-total.component.html',
  styleUrls: ['./inventario-total.component.css']
})
export class InventarioTotalComponent {
  filtro: string='';
  inventario = [
    { codigo: '001', nombre: 'Guantes', disponibles: 50, utilizados: 10, total: 60 },
    { codigo: '002', nombre: 'Mascarillas', disponibles: 100, utilizados: 90, total: 190 },
    { codigo: '003', nombre: 'Alcohol', disponibles: 30, utilizados: 5, total: 35 },
    { codigo: '004', nombre: 'Jeringas', disponibles: 200, utilizados: 150, total: 350 },
      { codigo: '005', nombre: 'Gasas estériles', disponibles: 500, utilizados: 300, total: 800 },
      { codigo: '006', nombre: 'Vendas', disponibles: 300, utilizados: 100, total: 400 },
      { codigo: '007', nombre: 'Termómetros', disponibles: 50, utilizados: 20, total: 70 },
      { codigo: '008', nombre: 'Paracetamol', disponibles: 1000, utilizados: 800, total: 1800 },
      { codigo: '009', nombre: 'Ibuprofeno', disponibles: 800, utilizados: 600, total: 1400 },
      { codigo: '010', nombre: 'Suero fisiológico', disponibles: 300, utilizados: 250, total: 550 },
      { codigo: '011', nombre: 'Agujas', disponibles: 400, utilizados: 350, total: 750 },
      { codigo: '012', nombre: 'Guantes de nitrilo', disponibles: 600, utilizados: 400, total: 1000 },
      { codigo: '013', nombre: 'Mascarillas N95', disponibles: 200, utilizados: 150, total: 350 },
      { codigo: '014', nombre: 'Batas desechables', disponibles: 300, utilizados: 200, total: 500 },
      { codigo: '015', nombre: 'Cubrezapatos', disponibles: 400, utilizados: 300, total: 700 },
      { codigo: '016', nombre: 'Gel antibacterial', disponibles: 150, utilizados: 100, total: 250 },
      { codigo: '017', nombre: 'Tiras reactivas', disponibles: 200, utilizados: 150, total: 350 },
      { codigo: '018', nombre: 'Insulina', disponibles: 100, utilizados: 80, total: 180 },
      { codigo: '019', nombre: 'Catéteres', disponibles: 300, utilizados: 250, total: 550 },
      { codigo: '020', nombre: 'Suturas', disponibles: 400, utilizados: 300, total: 700 },
      { codigo: '021', nombre: 'Bolsas de sangre', disponibles: 200, utilizados: 150, total: 350 },
      { codigo: '022', nombre: 'Cánulas', disponibles: 300, utilizados: 200, total: 500 },
      { codigo: '023', nombre: 'Morfina', disponibles: 50, utilizados: 30, total: 80 },
      { codigo: '024', nombre: 'Adrenalina', disponibles: 100, utilizados: 70, total: 170 },
      { codigo: '025', nombre: 'Antibióticos', disponibles: 500, utilizados: 400, total: 900 },
      { codigo: '026', nombre: 'Analgésicos', disponibles: 600, utilizados: 500, total: 1100 },
      { codigo: '027', nombre: 'Antisépticos', disponibles: 300, utilizados: 200, total: 500 },
      { codigo: '028', nombre: 'Esparadrapo', disponibles: 400, utilizados: 300, total: 700 },
      { codigo: '029', nombre: 'Tijeras quirúrgicas', disponibles: 50, utilizados: 30, total: 80 },
      { codigo: '030', nombre: 'Bisturíes', disponibles: 100, utilizados: 80, total: 180 },
      { codigo: '031', nombre: 'Guantes de látex', disponibles: 500, utilizados: 400, total: 900 },
      { codigo: '032', nombre: 'Mascarillas quirúrgicas', disponibles: 600, utilizados: 500, total: 1100 },
      { codigo: '033', nombre: 'Sondas', disponibles: 300, utilizados: 200, total: 500 },
      { codigo: '034', nombre: 'Ventiladores', disponibles: 20, utilizados: 15, total: 35 },
      { codigo: '035', nombre: 'Monitores de signos vitales', disponibles: 30, utilizados: 20, total: 50 },
      { codigo: '036', nombre: 'Desfibriladores', disponibles: 10, utilizados: 5, total: 15 },
      { codigo: '037', nombre: 'Camas hospitalarias', disponibles: 50, utilizados: 30, total: 80 },
      { codigo: '038', nombre: 'Carros de emergencia', disponibles: 15, utilizados: 10, total: 25 },
      { codigo: '039', nombre: 'Oxígeno medicinal', disponibles: 100, utilizados: 80, total: 180 },
      { codigo: '040', nombre: 'Máscaras de oxígeno', disponibles: 200, utilizados: 150, total: 350 },
      { codigo: '041', nombre: 'Nebulizadores', disponibles: 50, utilizados: 30, total: 80 },
      { codigo: '042', nombre: 'Equipos de succión', disponibles: 30, utilizados: 20, total: 50 },
      { codigo: '043', nombre: 'Laringoscopios', disponibles: 20, utilizados: 15, total: 35 }
  
  ];
  constructor(private router: Router) {}

  mediFiltrados() {
    return this.inventario.filter(inventario =>
      inventario.codigo.includes(this.filtro) || 
      inventario.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
}
