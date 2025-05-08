import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptimizationDataService {

  constructor() { }


  private data = {
    dataPacientesManana: null,
    dataPacientesTarde: null,
    dataPacientesNoche: null,

    dataEnfermerasManana: null,
    dataEnfermerasTarde: null,
    dataEnfermerasNoche: null,
  };

  // Métodos para establecer datos
  setInfoPacientesManana(info: any) {
    this.data.dataPacientesManana = info;
  }

  setInfoPacientesTarde(info: any) {
    this.data.dataPacientesTarde = info;
  }

  setInfoPacientesNoche(info: any) {
    this.data.dataPacientesNoche = info;
  }

  setInfoEnfermerasManana(info: any) {
    this.data.dataEnfermerasManana = info;
  }

  setInfoEnfermerasTarde(info: any) {
    this.data.dataEnfermerasTarde = info;
  }
  setInfoEnfermerasNoche(info: any) {
    this.data.dataEnfermerasNoche = info;
  }

  // Método para obtener todos los datos acumulados
  getAllData() {
    return this.data;
  }

  // Métodos para obtener datos
  getInfoPacientesManana() {
    return this.data.dataPacientesManana;
  }

  getInfoPacientesTarde() {
    return this.data.dataPacientesTarde;
  }

  getInfoPacientesNoche() {
    return this.data.dataPacientesNoche;
  }

  getInfoEnfermerasManana() {
    return this.data.dataEnfermerasManana;
  }

  getInfoEnfermerasTarde() {
    return this.data.dataEnfermerasTarde;
  }

  getInfoEnfermerasNoche() {
    return this.data.dataEnfermerasNoche;
  }

  // Métodos para obtener todos los datos de pacientes y enfermeras
  getAllPacientes() {
    return {
      dataPacientesManana: this.data.dataPacientesManana,
      dataPacientesTarde: this.data.dataPacientesTarde,
      dataPacientesNoche: this.data.dataPacientesNoche,
    };
  }

  getAllEnfermeras() {
    return {
      dataEnfermerasManana: this.data.dataEnfermerasManana,
      dataEnfermerasTarde: this.data.dataEnfermerasTarde,
      dataEnfermerasNoche: this.data.dataEnfermerasNoche,
    };
  }

  // Método para limpiar datos (opcional)
  clearData() {
    this.data = { dataPacientesManana: null, dataPacientesNoche: null, dataPacientesTarde:null, dataEnfermerasManana:  null, dataEnfermerasNoche:null, dataEnfermerasTarde:null };
  }


}
