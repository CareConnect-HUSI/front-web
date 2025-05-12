export interface Visita {
    id?: number; // Opcional porque se genera en el backend
    actividadPacienteVisitaId?: number;
    enfermeraId: number;
    fechaVisita?: string; // ISO date string (e.g., "2025-05-11")
    horaInicioEjecutada?: string; // ISO time string (e.g., "08:00:00")
    horaFinEjecutada?: string; // ISO time string (e.g., "09:00:00")
    estado?: string;
    horaInicioCalculada?: string; // ISO time string (e.g., "07:30:00")
    horaFinCalculada?: string; // ISO time string (e.g., "08:30:00")
  }