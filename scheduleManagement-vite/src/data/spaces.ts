export interface Spaces {
  id: string;
  nombre: string;
  capacidad: number;
  tipo: 'laboratorio' | 'salon' | 'auditorio';
  ubicacion: string;
}

export const ESPACIOS_INICIALES: Spaces[] = [
  // Laboratorios (12)
  { id: 'esp-1', nombre: 'Laboratorio de Computación 1 (LDC-1)', capacidad: 25, tipo: 'laboratorio', ubicacion: 'Edificio de Aulas, Piso 2' },
  { id: 'esp-2', nombre: 'Laboratorio de Computación 2 (LDC-2)', capacidad: 30, tipo: 'laboratorio', ubicacion: 'Edificio de Aulas, Piso 2' },
  { id: 'esp-3', nombre: 'Laboratorio de Redes y Telecomunicaciones', capacidad: 20, tipo: 'laboratorio', ubicacion: 'Edificio de Aulas, Piso 2' },
  { id: 'esp-4', nombre: 'Laboratorio de Física General', capacidad: 25, tipo: 'laboratorio', ubicacion: 'Edificio de Ciencias Básicas, PB' },
  { id: 'esp-5', nombre: 'Laboratorio de Química Orgánica', capacidad: 20, tipo: 'laboratorio', ubicacion: 'Edificio de Ciencias Básicas, Piso 1' },
  { id: 'esp-6', nombre: 'Laboratorio de Biología Celular', capacidad: 20, tipo: 'laboratorio', ubicacion: 'Edificio de Ciencias Básicas, Piso 1' },
  { id: 'esp-7', nombre: 'Laboratorio de Microcomputadores', capacidad: 22, tipo: 'laboratorio', ubicacion: 'Edificio de Aulas, Piso 2' },
  { id: 'esp-8', nombre: 'Laboratorio de Electrónica Digital', capacidad: 18, tipo: 'laboratorio', ubicacion: 'Edificio de Aulas, PB' },
  { id: 'esp-9', nombre: 'Laboratorio de Análisis Instrumental', capacidad: 15, tipo: 'laboratorio', ubicacion: 'Edificio de Ciencias Básicas, Piso 2' },
  { id: 'esp-10', nombre: 'Laboratorio de Bioquímica', capacidad: 20, tipo: 'laboratorio', ubicacion: 'Edificio de Ciencias Básicas, PB' },
  { id: 'esp-11', nombre: 'Laboratorio de Robótica e Inteligencia Artificial', capacidad: 15, tipo: 'laboratorio', ubicacion: 'Edificio de Aulas, Piso 2' },
  { id: 'esp-12', nombre: 'Laboratorio de Investigaciones Químicas (LIQ)', capacidad: 12, tipo: 'laboratorio', ubicacion: 'Edificio de Investigación, Piso 1' },

  // Auditorios y Espacios Múltiples (5)
  { id: 'esp-13', nombre: 'Auditorio Principal FaCyT', capacidad: 150, tipo: 'auditorio', ubicacion: 'Edificio de Decanato, PB' },
  { id: 'esp-14', nombre: 'Auditorio de Postgrado', capacidad: 80, tipo: 'auditorio', ubicacion: 'Edificio de Postgrado, Piso 1' },
  { id: 'esp-15', nombre: 'Sala de Conferencias "Dr. Claudio Bifano"', capacidad: 50, tipo: 'auditorio', ubicacion: 'Edificio de Decanato, Piso 1' },
  { id: 'esp-16', nombre: 'Mini Auditorio de Ciencias', capacidad: 60, tipo: 'auditorio', ubicacion: 'Edificio de Ciencias Básicas, PB' },
  { id: 'esp-17', nombre: 'Auditorio de Usos Múltiples UC', capacidad: 200, tipo: 'auditorio', ubicacion: 'Área Central UC' },

  // Salones / Aulas (13)
  { id: 'esp-18', nombre: 'Salón 1', capacidad: 45, tipo: 'salon', ubicacion: 'Edificio de Aulas, PB' },
  { id: 'esp-19', nombre: 'Salón 2', capacidad: 45, tipo: 'salon', ubicacion: 'Edificio de Aulas, PB' },
  { id: 'esp-20', nombre: 'Salón 3', capacidad: 40, tipo: 'salon', ubicacion: 'Edificio de Aulas, PB' },
  { id: 'esp-21', nombre: 'Salón 4', capacidad: 40, tipo: 'salon', ubicacion: 'Edificio de Aulas, Piso 1' },
  { id: 'esp-22', nombre: 'Salón 5', capacidad: 40, tipo: 'salon', ubicacion: 'Edificio de Aulas, Piso 1' },
  { id: 'esp-23', nombre: 'Salón 6', capacidad: 35, tipo: 'salon', ubicacion: 'Edificio de Aulas, Piso 1' },
  { id: 'esp-24', nombre: 'Salón 7', capacidad: 35, tipo: 'salon', ubicacion: 'Edificio de Aulas, Piso 1' },
  { id: 'esp-25', nombre: 'Salón 8', capacidad: 30, tipo: 'salon', ubicacion: 'Edificio de Aulas, Piso 2' },
  { id: 'esp-26', nombre: 'Salón 9', capacidad: 30, tipo: 'salon', ubicacion: 'Edificio de Aulas, Piso 2' },
  { id: 'esp-27', nombre: 'Salón 10', capacidad: 50, tipo: 'salon', ubicacion: 'Edificio de Aulas, Piso 2' },
  { id: 'esp-28', nombre: 'Salón de Seminarios Mathemata', capacidad: 25, tipo: 'salon', ubicacion: 'Departamento de Matemáticas, PB' },
  { id: 'esp-29', nombre: 'Salón de Usos Múltiples Biología', capacidad: 30, tipo: 'salon', ubicacion: 'Departamento de Biología, Piso 1' },
  { id: 'esp-30', nombre: 'Aula Magna de Computación', capacidad: 60, tipo: 'salon', ubicacion: 'Departamento de Computación, PB' }
];