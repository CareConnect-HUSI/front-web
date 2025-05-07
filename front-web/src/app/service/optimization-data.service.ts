import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptimizationDataService {

  constructor() { }


  private data = {
    dataPacientes: null,
    dataEnfermeras: null,
  };

  // Métodos para establecer datos
  setInfoPacientes(info: any) {
    this.data.dataPacientes = info;
  }

  setInfoEnfermeras(info: any) {
    this.data.dataEnfermeras = info;
  }

  // Método para obtener todos los datos acumulados
  getAllData() {
    return this.data;
  }

  // Método para limpiar datos (opcional)
  clearData() {
    this.data = { dataPacientes: null, dataEnfermeras: null };
  }


}
