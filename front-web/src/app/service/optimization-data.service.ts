import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OptimizationDataService {
  private apiUrl = 'http://localhost:8086/rutas';

  constructor(private http: HttpClient) {}

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

  generarCronogramaManana() {
    const horaInicio = '7:00';
    const tipoTurno = 6;
    const margen = 1.5; // Assumed margin of 1 hour for time window

    // Get nurse and patient data
    const enfermeras = this.getInfoEnfermerasManana() || [];
    const pacientes = this.getInfoPacientesManana() || [];
    const numMaxEnfermeras = enfermeras.length;

    // Helper function to convert time string (HH:mm) to hours
    const timeToHours = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours + minutes / 60;
    };

    // Initialize arrays for the JSON package
    const ids: string[] = [];
    const coordenadas: number[][] = [];
    const tiempoAtencion: number[] = [];
    const matrizVentanaTiempo: number[][] = [];

    // Process nurses
    enfermeras.forEach((enfermera: any) => {
      ids.push(enfermera.numeroIdentificacion.toString());
      var latitud = enfermera.latitud;
      var longitud = enfermera.longitud;
      var coordenada = [latitud, longitud];

      coordenadas.push(coordenada);

      tiempoAtencion.push(0);
      matrizVentanaTiempo.push([0, 6]);
    });

    // Process patients
    pacientes.forEach((paciente: any) => {
      ids.push(paciente.numero_identificacion.toString());
      const latitud = paciente.latitud;
      const longitud = paciente.longitud;
      coordenadas.push([latitud, longitud]);
    
      const actividades = paciente.actividades || [];
    
      // Sumar todas las duraciones
      const totalDuracion = actividades.reduce(
        (sum: number, act: any) => sum + (act.duracionVisita || 0),
        0
      );
      const tempoVisita = totalDuracion/60 // Pasar de minutos a horas
      tiempoAtencion.push(tempoVisita);


      // Buscar la primera hora recomendada válida en las actividades
      let horaRecomendada: number | null = null;
      for (const act of actividades) {
        if (act.hora) {
          horaRecomendada = timeToHours(act.hora);
          break;
        }
      }
    
      if (horaRecomendada !== null) {
        const horaInicioHours = timeToHours(horaInicio);
        const diff = horaRecomendada - horaInicioHours;
        const valorInicial = Math.max(0, diff - margen);
        const valorFinal = Math.max(0, diff + margen);
        matrizVentanaTiempo.push([valorInicial, valorFinal]);
      } else {
        matrizVentanaTiempo.push([0, 6]); // Default si no hay hora
      }
    });
    

    // Construct JSON package
    const payload = {
      coordenadas,
      matrizVentanaTiempo,
      tiempoAtencion,
      ids,
      tipoTurno,
      numMaxEnfermeras,
      horaInicio,
    };

    // Set headers and make HTTP POST request
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log('Payload para la API:', payload);

    return this.http.post<any>(`${this.apiUrl}`, payload).subscribe({
      next: (response) => {
        console.log('Respuesta:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  // Método para limpiar datos (opcional)
  clearData() {
    this.data = {
      dataPacientesManana: null,
      dataPacientesNoche: null,
      dataPacientesTarde: null,
      dataEnfermerasManana: null,
      dataEnfermerasNoche: null,
      dataEnfermerasTarde: null,
    };
  }
}
