export interface Event {
    id: string;
    titulo: string;
    espacioId: string; // Relacionado con el ID del espacio
    responsable: string;
    fecha: string;
    asistentes: number;
    horaInicio: string;
    horaFin: string;
    estado: 'solicitado' | 'aprobado' | 'rechazado'| 'realizado'| 'cancelado' ;
  }

  export const EVENTOS_INICIALES: Event[] = [
    {
      id: 'evt-1',
      titulo: 'Defensas de Seminario de Proyecto',
      espacioId: 'esp-1',
      responsable: 'Prof. Carlos Martínez',
      fecha: '2026-07-22',
      asistentes: 10,
      horaInicio: '08:00',
      horaFin: '12:00',
      estado: 'aprobado'
    },
    {
      id: 'evt-2',
      titulo: 'Taller de React y TypeScript',
      espacioId: 'esp-2',
      responsable: 'Centro de Estudiantes',
      fecha: '2026-07-24',
      asistentes: 10,
      horaInicio: '14:00',
      horaFin: '16:00',
      estado: 'solicitado'
    }
  ];