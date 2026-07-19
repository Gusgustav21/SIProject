export interface Spaces {
    id: string;
    nombre: string;
    capacidad: number;
    tipo: 'laboratorio' | 'salon' | 'auditorio';
    ubicacion: string;
  }

// Datos iniciales simulados para la FaCyT
export const ESPACIOS_INICIALES: Spaces[] = [
    { id: 'esp-1', nombre: 'Laboratorio de Computación 1', capacidad: 25, tipo: 'laboratorio', ubicacion: 'Edificio de Aulas, Piso 2' },
    { id: 'esp-2', nombre: 'Auditorio Principal', capacidad: 120, tipo: 'auditorio', ubicacion: 'Planta Baja' },
    { id: 'esp-3', nombre: 'Salón 5', capacidad: 40, tipo: 'salon', ubicacion: 'Edificio de Aulas, Piso 1' },
  ];