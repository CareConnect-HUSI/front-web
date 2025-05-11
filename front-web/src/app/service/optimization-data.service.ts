import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

// Interfaces defined here or in a separate file
export interface RawNurse {
  numeroIdentificacion: number;
  name: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
}

export interface RawPatient {
  numero_identificacion: number;
  name: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  actividades?: { duracionVisita: number; hora: string; prioridad?: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class OptimizationDataService {
  private apiUrl = 'http://localhost:8086/rutas';

  constructor(private http: HttpClient) {}

  private data: {
    dataPacientesManana: RawPatient[] | null;
    dataPacientesTarde: RawPatient[] | null;
    dataPacientesNoche: RawPatient[] | null;
    dataEnfermerasManana: RawNurse[] | null;
    dataEnfermerasTarde: RawNurse[] | null;
    dataEnfermerasNoche: RawNurse[] | null;
  } = {
    dataPacientesManana: null,
    dataPacientesTarde: null,
    dataPacientesNoche: null,
    dataEnfermerasManana: null,
    dataEnfermerasTarde: null,
    dataEnfermerasNoche: null,
  };

  private respuestaManana: any = '';
  private respuestaTarde: any = '';
  private respuestaNoche: any = '';
  private borrador: boolean = false;

  public getBorrador(): boolean {
    return this.borrador;
  }

  public setBorrador(valor: boolean): void {
    this.borrador = valor;
  }

  public getRespuestaManana(): any {
    return this.respuestaManana;
  }

  public setRespuestaManana(valor: any): void {
    this.respuestaManana = valor;
  }

  public getRespuestaTarde(): any {
    return this.respuestaTarde;
  }

  public setRespuestaTarde(valor: any): void {
    this.respuestaTarde = valor;
  }

  public getRespuestaNoche(): any {
    return this.respuestaNoche;
  }

  public setRespuestaNoche(valor: any): void {
    this.respuestaNoche = valor;
  }

  // Métodos para establecer datos
  setInfoPacientesManana(info: RawPatient[] | null) {
    this.data.dataPacientesManana = info;
  }

  setInfoPacientesTarde(info: RawPatient[] | null) {
    this.data.dataPacientesTarde = info;
  }

  setInfoPacientesNoche(info: RawPatient[] | null) {
    this.data.dataPacientesNoche = info;
  }

  setInfoEnfermerasManana(info: RawNurse[] | null) {
    this.data.dataEnfermerasManana = info;
  }

  setInfoEnfermerasTarde(info: RawNurse[] | null) {
    this.data.dataEnfermerasTarde = info;
  }

  setInfoEnfermerasNoche(info: RawNurse[] | null) {
    this.data.dataEnfermerasNoche = info;
  }

  // Método para obtener todos los datos acumulados
  getAllData(): {
    dataPacientesManana: RawPatient[] | null;
    dataPacientesTarde: RawPatient[] | null;
    dataPacientesNoche: RawPatient[] | null;
    dataEnfermerasManana: RawNurse[] | null;
    dataEnfermerasTarde: RawNurse[] | null;
    dataEnfermerasNoche: RawNurse[] | null;
  } {
    return this.data;
  }

  // Métodos para obtener datos
  getInfoPacientesManana(): RawPatient[] | null {
    return this.data.dataPacientesManana;
  }

  getInfoPacientesTarde(): RawPatient[] | null {
    return this.data.dataPacientesTarde;
  }

  getInfoPacientesNoche(): RawPatient[] | null {
    return this.data.dataPacientesNoche;
  }

  getInfoEnfermerasManana(): RawNurse[] | null {
    return this.data.dataEnfermerasManana;
  }

  getInfoEnfermerasTarde(): RawNurse[] | null {
    return this.data.dataEnfermerasTarde;
  }

  getInfoEnfermerasNoche(): RawNurse[] | null {
    return this.data.dataEnfermerasNoche;
  }

  getAllPacientes(): {
    dataPacientesManana: RawPatient[] | null;
    dataPacientesTarde: RawPatient[] | null;
    dataPacientesNoche: RawPatient[] | null;
  } {
    return {
      dataPacientesManana: this.data.dataPacientesManana,
      dataPacientesTarde: this.data.dataPacientesTarde,
      dataPacientesNoche: this.data.dataPacientesNoche,
    };
  }

  getAllEnfermeras(): {
    dataEnfermerasManana: RawNurse[] | null;
    dataEnfermerasTarde: RawNurse[] | null;
    dataEnfermerasNoche: RawNurse[] | null;
  } {
    return {
      dataEnfermerasManana: this.data.dataEnfermerasManana,
      dataEnfermerasTarde: this.data.dataEnfermerasTarde,
      dataEnfermerasNoche: this.data.dataEnfermerasNoche,
    };
  }

  generarCronogramaManana() {
    const horaInicio = '7:00';
    const tipoTurno = 6;
    const margen = 0.5;

    const enfermeras = this.getInfoEnfermerasManana() || [];
    const pacientes = this.getInfoPacientesManana() || [];
    const numMaxEnfermeras = enfermeras.length;

    const timeToHours = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours + minutes / 60;
    };

    const ids: string[] = [];
    const coordenadas: number[][] = [];
    const tiempoAtencion: number[] = [];
    const matrizVentanaTiempo: number[][] = [];

    enfermeras.forEach((enfermera: RawNurse) => {
      ids.push(enfermera.numeroIdentificacion.toString());
      const coordenada = [enfermera.latitud || 0, enfermera.longitud || 0];
      coordenadas.push(coordenada);
      tiempoAtencion.push(0);
      matrizVentanaTiempo.push([0, 6]);
    });

    pacientes.forEach((paciente: RawPatient) => {
      ids.push(paciente.numero_identificacion.toString());
      coordenadas.push([paciente.latitud || 0, paciente.longitud || 0]);

      const actividades = paciente.actividades || [];
      const totalDuracion = actividades.reduce(
        (sum: number, act: any) => sum + (act.duracionVisita || 0),
        0
      );
      const tempoVisita = totalDuracion / 60;
      tiempoAtencion.push(tempoVisita);

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
        matrizVentanaTiempo.push([0, 6]);
      }
    });

    const payload = {
      coordenadas,
      matrizVentanaTiempo,
      tiempoAtencion,
      ids,
      tipoTurno,
      numMaxEnfermeras,
      horaInicio,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log('Payload para la API:', payload);

    return this.http.post<any>(`${this.apiUrl}`, payload, { headers }).pipe(
      tap((response) => {
        console.log('Respuesta recibida:', response);
        this.setRespuestaManana(response);
      }),
      catchError((error) => {
        console.error('Error en la API:', error);
        return throwError(() => new Error('Error en la API: ' + error.message));
      })
    );
  }

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