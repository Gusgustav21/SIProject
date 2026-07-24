export type EventStatus = 'solicitado' | 'aprobado' | 'rechazado' | 'realizado' | 'cancelado'

export interface Event {
  id: string;
  titulo: string;
  espacioId: string;
  responsable: string;
  fecha: string;
  asistentes: number;
  horaInicio: string;
  horaFin: string;
  estado: EventStatus;
}

export const EVENTOS_INICIALES: Event[] = [
  // --- APROBADOS (Aproximadamente 45%) ---
  { id: 'evt-1', titulo: 'Defensas de Seminario de Proyecto', espacioId: 'esp-1', responsable: 'Prof. Carlos Martínez', fecha: '2026-07-22', asistentes: 10, horaInicio: '08:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-2', titulo: 'Taller de Algoritmos Avanzados', espacioId: 'esp-2', responsable: 'Dpto. de Computación', fecha: '2026-07-23', asistentes: 20, horaInicio: '09:00', horaFin: '11:30', estado: 'aprobado' },
  { id: 'evt-3', titulo: 'Práctica de Laboratorio de Química I', espacioId: 'esp-5', responsable: 'Dra. María Fernández', fecha: '2026-07-23', asistentes: 15, horaInicio: '10:00', horaFin: '13:00', estado: 'aprobado' },
  { id: 'evt-4', titulo: 'Charla sobre Energías Renovables', espacioId: 'esp-13', responsable: 'Decanato FaCyT', fecha: '2026-07-24', asistentes: 120, horaInicio: '10:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-5', titulo: 'Examen Parcial de Cálculo III', espacioId: 'esp-18', responsable: 'Prof. Roberto Gómez', fecha: '2026-07-24', asistentes: 40, horaInicio: '08:00', horaFin: '10:00', estado: 'aprobado' },
  { id: 'evt-6', titulo: 'Seminario de Biotecnología Vegetal', espacioId: 'esp-15', responsable: 'Dpto. de Biología', fecha: '2026-07-25', asistentes: 35, horaInicio: '14:00', horaFin: '17:00', estado: 'aprobado' },
  { id: 'evt-7', titulo: 'Taller Introductorio a Python', espacioId: 'esp-7', responsable: 'Centro de Estudiantes FaCyT', fecha: '2026-07-27', asistentes: 20, horaInicio: '09:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-8', titulo: 'Conferencia de Física Cuántica', espacioId: 'esp-14', responsable: 'Prof. Alejandro Rivas', fecha: '2026-07-27', asistentes: 50, horaInicio: '11:00', horaFin: '13:00', estado: 'aprobado' },
  { id: 'evt-9', titulo: 'Práctica de Circuitos Digitales', espacioId: 'esp-8', responsable: 'Ing. José López', fecha: '2026-07-28', asistentes: 15, horaInicio: '08:00', horaFin: '11:00', estado: 'aprobado' },
  { id: 'evt-10', titulo: 'Defensa de Trabajo Especial de Grado - Computación', espacioId: 'esp-30', responsable: 'Prof. Elena Torres', fecha: '2026-07-28', asistentes: 25, horaInicio: '14:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-11', titulo: 'Asamblea de Facultad de Profesores', espacioId: 'esp-13', responsable: 'Asociación de Profesores UC', fecha: '2026-07-29', asistentes: 100, horaInicio: '09:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-12', titulo: 'Taller de Ciberseguridad y Redes', espacioId: 'esp-3', responsable: 'Prof. Ricardo Silva', fecha: '2026-07-29', asistentes: 18, horaInicio: '13:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-13', titulo: 'Práctica de Óptica y Magnetismo', espacioId: 'esp-4', responsable: 'Dra. Carmen Mendoza', fecha: '2026-07-30', asistentes: 20, horaInicio: '08:00', horaFin: '10:30', estado: 'aprobado' },
  { id: 'evt-14', titulo: 'Foro: Futuro del Software Libre en Venezuela', espacioId: 'esp-16', responsable: 'Grupo de Usuarios Linux UC', fecha: '2026-07-30', asistentes: 45, horaInicio: '14:00', horaFin: '17:00', estado: 'aprobado' },
  { id: 'evt-15', titulo: 'Clase Magistral de Álgebra Lineal', espacioId: 'esp-27', responsable: 'Prof. Luis Hernández', fecha: '2026-07-31', asistentes: 45, horaInicio: '10:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-16', titulo: 'Jornada de Recolección de Desechos Químicos', espacioId: 'esp-9', responsable: 'Comisión Ambiental FaCyT', fecha: '2026-08-03', asistentes: 12, horaInicio: '08:30', horaFin: '11:30', estado: 'aprobado' },
  { id: 'evt-17', titulo: 'Taller de Desarrollo Web con React y Vite', espacioId: 'esp-1', responsable: 'Preparaduría de Computación', fecha: '2026-08-03', asistentes: 22, horaInicio: '13:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-18', titulo: 'Examen Extraordinario de Química Analítica', espacioId: 'esp-21', responsable: 'Dpto. de Química', fecha: '2026-08-04', asistentes: 30, horaInicio: '08:00', horaFin: '10:30', estado: 'aprobado' },
  { id: 'evt-19', titulo: 'Charla Informativa sobre Pasantías Industriales', espacioId: 'esp-13', responsable: 'Coordinación de Extension FaCyT', fecha: '2026-08-04', asistentes: 110, horaInicio: '11:00', horaFin: '13:00', estado: 'aprobado' },
  { id: 'evt-20', titulo: 'Simposio Internacional de Matemática Aplicada', espacioId: 'esp-17', responsable: 'Dpto. de Matemáticas', fecha: '2026-08-05', asistentes: 130, horaInicio: '09:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-21', titulo: 'Laboratorio de Genética y ADN', espacioId: 'esp-6', responsable: 'Dra. Sofía Blanco', fecha: '2026-08-05', asistentes: 18, horaInicio: '08:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-22', titulo: 'Práctica Libre de Programación Competitiva', espacioId: 'esp-2', responsable: 'Club de Algoritmos UC', fecha: '2026-08-06', asistentes: 25, horaInicio: '14:00', horaFin: '18:00', estado: 'aprobado' },
  { id: 'evt-23', titulo: 'Reunión de Consejo de Facultad', espacioId: 'esp-15', responsable: 'Decanato FaCyT', fecha: '2026-08-07', asistentes: 20, horaInicio: '09:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-24', titulo: 'Defensa de Tesis de Maestría en Física', espacioId: 'esp-14', responsable: 'Coordinación de Postgrado', fecha: '2026-08-07', asistentes: 30, horaInicio: '10:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-25', titulo: 'Curso Básico de Arduino y Sensores', espacioId: 'esp-11', responsable: 'Laboratorio de Robótica', fecha: '2026-08-10', asistentes: 12, horaInicio: '09:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-26', titulo: 'Seminario de Microbiología Ambiental', espacioId: 'esp-29', responsable: 'Dpto. de Biología', fecha: '2026-08-10', asistentes: 25, horaInicio: '14:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-27', titulo: 'Evaluación Sumativa de Geometría Analítica', espacioId: 'esp-20', responsable: 'Prof. Fernando Castro', fecha: '2026-08-11', asistentes: 35, horaInicio: '08:00', horaFin: '10:00', estado: 'aprobado' },
  { id: 'evt-28', titulo: 'Mesa Redonda: Impacto del Cambio Climático', espacioId: 'esp-16', responsable: 'Centro de Investigaciones Ecológicas', fecha: '2026-08-11', asistentes: 40, horaInicio: '10:30', horaFin: '12:30', estado: 'aprobado' },
  { id: 'evt-29', titulo: 'Práctica de Bioquímica Enzimática', espacioId: 'esp-10', responsable: 'Dr. Héctor Suárez', fecha: '2026-08-12', asistentes: 18, horaInicio: '08:00', horaFin: '11:00', estado: 'aprobado' },
  { id: 'evt-30', titulo: 'Taller de Bases de Datos Relacionales (PostgreSQL)', espacioId: 'esp-1', responsable: 'Prof. Patricia Díaz', fecha: '2026-08-12', asistentes: 22, horaInicio: '11:30', horaFin: '14:00', estado: 'aprobado' },
  { id: 'evt-31', titulo: 'Conferencia: Inteligencia Artificial en la Medicina', espacioId: 'esp-13', responsable: 'Dpto. de Computación', fecha: '2026-08-13', asistentes: 140, horaInicio: '10:00', horaFin: '12:30', estado: 'aprobado' },
  { id: 'evt-32', titulo: 'Clase Práctica de Mecánica Clásica', espacioId: 'esp-23', responsable: 'Prof. Mario Ortega', fecha: '2026-08-13', asistentes: 30, horaInicio: '14:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-33', titulo: 'Exposición de Proyectos de Modelado 3D', espacioId: 'esp-7', responsable: 'Ing. Gabriel Ramos', fecha: '2026-08-14', asistentes: 18, horaInicio: '09:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-34', titulo: 'Seminario de Historia de las Matemáticas', espacioId: 'esp-28', responsable: 'Dpto. de Matemáticas', fecha: '2026-08-14', asistentes: 20, horaInicio: '14:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-35', titulo: 'Taller de Git y GitHub para Proyectos Académicos', espacioId: 'esp-2', responsable: 'Preparaduría de Sistemas', fecha: '2026-08-17', asistentes: 28, horaInicio: '09:00', horaFin: '11:30', estado: 'aprobado' },
  { id: 'evt-36', titulo: 'Práctica de Laboratorio de Botánica', espacioId: 'esp-6', responsable: 'Dra. Teresa Morales', fecha: '2026-08-17', asistentes: 16, horaInicio: '13:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-37', titulo: 'Taller de Introducción a Docker', espacioId: 'esp-3', responsable: 'Prof. Carlos Martínez', fecha: '2026-08-18', asistentes: 18, horaInicio: '10:00', horaFin: '13:00', estado: 'aprobado' },
  { id: 'evt-38', titulo: 'Jornadas Estudiantiles de Investigación', espacioId: 'esp-17', responsable: 'Comisión de Investigación FaCyT', fecha: '2026-08-19', asistentes: 180, horaInicio: '08:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-39', titulo: 'Examen de Recuperación de Química General', espacioId: 'esp-19', responsable: 'Dpto. de Química', fecha: '2026-08-20', asistentes: 35, horaInicio: '08:00', horaFin: '10:00', estado: 'aprobado' },
  { id: 'evt-40', titulo: 'Charla Orientación para Nuevos Ingresos', espacioId: 'esp-13', responsable: 'Dirección de Dirección Estudiantil UC', fecha: '2026-08-20', asistentes: 130, horaInicio: '11:00', horaFin: '13:00', estado: 'aprobado' },
  { id: 'evt-41', titulo: 'Práctica de Métodos Numéricos', espacioId: 'esp-1', responsable: 'Prof. Roberto Gómez', fecha: '2026-08-21', asistentes: 20, horaInicio: '08:00', horaFin: '11:00', estado: 'aprobado' },
  { id: 'evt-42', titulo: 'Defensa de Tesis de Licenciatura en Química', espacioId: 'esp-15', responsable: 'Comité de Grado Química', fecha: '2026-08-21', asistentes: 25, horaInicio: '14:00', horaFin: '16:00', estado: 'aprobado' },
  { id: 'evt-43', titulo: 'Taller de Inteligencia Artificial Generativa', espacioId: 'esp-11', responsable: 'Prof. Ricardo Silva', fecha: '2026-08-24', asistentes: 14, horaInicio: '09:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-44', titulo: 'Conferencia sobre Nanotecnología', espacioId: 'esp-14', responsable: 'Dpto. de Física', fecha: '2026-08-25', asistentes: 65, horaInicio: '10:00', horaFin: '12:00', estado: 'aprobado' },
  { id: 'evt-45', titulo: 'Evaluación Parcial de Programación I', espacioId: 'esp-2', responsable: 'Prof. Patricia Díaz', fecha: '2026-08-26', asistentes: 28, horaInicio: '08:00', horaFin: '11:00', estado: 'aprobado' },

  // --- SOLICITADOS (Aproximadamente 25%) ---
  { id: 'evt-46', titulo: 'Taller de React y TypeScript', espacioId: 'esp-2', responsable: 'Centro de Estudiantes', fecha: '2026-07-24', asistentes: 10, horaInicio: '14:00', horaFin: '16:00', estado: 'solicitado' },
  { id: 'evt-47', titulo: 'Torneo Interdisciplinario de Ajedrez', espacioId: 'esp-22', responsable: 'Club de Ajedrez UC', fecha: '2026-07-27', asistentes: 30, horaInicio: '13:00', horaFin: '17:00', estado: 'solicitado' },
  { id: 'evt-48', titulo: 'Reunión Preparatoria Feria de Ciencias', espacioId: 'esp-28', responsable: 'Prof. Ana Guinand', fecha: '2026-07-28', asistentes: 15, horaInicio: '11:00', horaFin: '13:00', estado: 'solicitado' },
  { id: 'evt-49', titulo: 'Curso Extracurricular de Node.js', espacioId: 'esp-1', responsable: 'Br. Andrés Bello', fecha: '2026-07-31', asistentes: 20, horaInicio: '14:00', horaFin: '17:00', estado: 'solicitado' },
  { id: 'evt-50', titulo: 'Taller de Expresión Oral para Defensas', espacioId: 'esp-25', responsable: 'Coordinación Cultural FaCyT', fecha: '2026-08-03', asistentes: 25, horaInicio: '10:00', horaFin: '12:00', estado: 'solicitado' },
  { id: 'evt-51', titulo: 'Cine Foro: Documental de Historia de la Computación', espacioId: 'esp-16', responsable: 'Centro de Estudiantes Computación', fecha: '2026-08-04', asistentes: 40, horaInicio: '14:00', horaFin: '16:30', estado: 'solicitado' },
  { id: 'evt-52', titulo: 'Ensayo de Grupo de Teatro UC', espacioId: 'esp-13', responsable: 'Dirección de Cultura UC', fecha: '2026-08-06', asistentes: 30, horaInicio: '15:00', horaFin: '18:00', estado: 'solicitado' },
  { id: 'evt-53', titulo: 'Charla sobre Oportunidades de Becas Internacionales', espacioId: 'esp-14', responsable: 'Asociación de Egresados UC', fecha: '2026-08-07', asistentes: 60, horaInicio: '14:00', horaFin: '16:00', estado: 'solicitado' },
  { id: 'evt-54', titulo: 'Práctica Extra de Laboratorio de Redes', espacioId: 'esp-3', responsable: 'Br. Manuel Sosa', fecha: '2026-08-10', asistentes: 15, horaInicio: '08:00', horaFin: '11:00', estado: 'solicitado' },
  { id: 'evt-55', titulo: 'Taller Básico de Diseño Gráfico para Prototipos', espacioId: 'esp-7', responsable: 'Grupo de Innovación FaCyT', fecha: '2026-08-11', asistentes: 15, horaInicio: '13:00', horaFin: '15:30', estado: 'solicitado' },
  { id: 'evt-56', titulo: 'Encuentro de Estudiantes de Física', espacioId: 'esp-24', responsable: 'Comité de Estudiantes de Física', fecha: '2026-08-12', asistentes: 25, horaInicio: '10:00', horaFin: '12:00', estado: 'solicitado' },
  { id: 'evt-57', titulo: 'Reunión de Organización de Bienvenida', espacioId: 'esp-26', responsable: 'Centro de Estudiantes', fecha: '2026-08-13', asistentes: 20, horaInicio: '11:00', horaFin: '13:00', estado: 'solicitado' },
  { id: 'evt-58', titulo: 'Clase de Reforzamiento de Ecuaciones Diferenciales', espacioId: 'esp-21', responsable: 'Preparaduría de Matemáticas', fecha: '2026-08-14', asistentes: 30, horaInicio: '08:00', horaFin: '10:00', estado: 'solicitado' },
  { id: 'evt-59', titulo: 'Taller de Desarrollo de Videojuegos con Unity', espacioId: 'esp-2', responsable: 'Br. Kevin Parra', fecha: '2026-08-17', asistentes: 25, horaInicio: '14:00', horaFin: '17:00', estado: 'solicitado' },
  { id: 'evt-60', titulo: 'Conferencia de Divulgación Astronómica', espacioId: 'esp-13', responsable: 'Grupo de Astronomía UC', fecha: '2026-08-18', asistentes: 90, horaInicio: '14:00', horaFin: '16:00', estado: 'solicitado' },
  { id: 'evt-61', titulo: 'Muestra Fotográfica de Flora y Fauna de Carabobo', espacioId: 'esp-15', responsable: 'Dpto. de Biología', fecha: '2026-08-20', asistentes: 40, horaInicio: '09:00', horaFin: '15:00', estado: 'solicitado' },
  { id: 'evt-62', titulo: 'Taller de Primeros Auxilios en Laboratorios', espacioId: 'esp-18', responsable: 'Brigada de Emergencia UC', fecha: '2026-08-21', asistentes: 35, horaInicio: '09:00', horaFin: '12:00', estado: 'solicitado' },
  { id: 'evt-63', titulo: 'Reunión del Comité Editorial de la Revista Científica', espacioId: 'esp-28', responsable: 'Dra. María Fernández', fecha: '2026-08-24', asistentes: 12, horaInicio: '10:00', horaFin: '12:00', estado: 'solicitado' },
  { id: 'evt-64', titulo: 'Seminario de Optimización Matemática', espacioId: 'esp-30', responsable: 'Prof. Luis Hernández', fecha: '2026-08-25', asistentes: 20, horaInicio: '14:00', horaFin: '16:00', estado: 'solicitado' },
  { id: 'evt-65', titulo: 'Hackathon Estudiantil FaCyT 2026', espacioId: 'esp-1', responsable: 'Centro de Estudiantes Computación', fecha: '2026-08-28', asistentes: 25, horaInicio: '08:00', horaFin: '18:00', estado: 'solicitado' },
  { id: 'evt-66', titulo: 'Taller de Redacción de Artículos Científicos', espacioId: 'esp-14', responsable: 'Coordinación de Postgrado', fecha: '2026-08-28', asistentes: 40, horaInicio: '09:00', horaFin: '12:00', estado: 'solicitado' },
  { id: 'evt-67', titulo: 'Charla sobre Salud Mental Universitaria', espacioId: 'esp-16', responsable: 'Dirección de Desarrollo Estudiantil', fecha: '2026-08-28', asistentes: 50, horaInicio: '14:00', horaFin: '16:00', estado: 'solicitado' },

  // --- RECHAZADOS (Aproximadamente 12%) ---
  { id: 'evt-68', titulo: 'Fiesta Temática Fin de Semestre', espacioId: 'esp-13', responsable: 'Grupo Particular', fecha: '2026-07-25', asistentes: 250, horaInicio: '18:00', horaFin: '23:00', estado: 'rechazado' },
  { id: 'evt-69', titulo: 'Venta de Garaje Estudiantil', espacioId: 'esp-18', responsable: 'Br. Laura Pérez', fecha: '2026-07-28', asistentes: 50, horaInicio: '08:00', horaFin: '14:00', estado: 'rechazado' },
  { id: 'evt-70', titulo: 'Torneo de Videojuegos en Red', espacioId: 'esp-1', responsable: 'Br. Daniel Rivas', fecha: '2026-07-30', asistentes: 40, horaInicio: '12:00', horaFin: '18:00', estado: 'rechazado' },
  { id: 'evt-71', titulo: 'Grabación de Comercial Publicitario Externo', espacioId: 'esp-15', responsable: 'Productora Externa', fecha: '2026-08-03', asistentes: 30, horaInicio: '08:00', horaFin: '16:00', estado: 'rechazado' },
  { id: 'evt-72', titulo: 'Taller Comercial de Trading y Criptomonedas', espacioId: 'esp-14', responsable: 'Agencia Externa', fecha: '2026-08-05', asistentes: 90, horaInicio: '13:00', horaFin: '17:00', estado: 'rechazado' },
  { id: 'evt-73', titulo: 'Práctica de Banda Musical Privada', espacioId: 'esp-16', responsable: 'Br. Gabriel Medina', fecha: '2026-08-07', asistentes: 15, horaInicio: '16:00', horaFin: '19:00', estado: 'rechazado' },
  { id: 'evt-74', titulo: 'Examen de Admisión No Autorizado', espacioId: 'esp-27', responsable: 'Instituto Privado', fecha: '2026-08-11', asistentes: 60, horaInicio: '08:00', horaFin: '12:00', estado: 'rechazado' },
  { id: 'evt-75', titulo: 'Curso Pagado de Excel Empresarial', espacioId: 'esp-2', responsable: 'Consultora Externa', fecha: '2026-08-13', asistentes: 35, horaInicio: '09:00', horaFin: '15:00', estado: 'rechazado' },
  { id: 'evt-76', titulo: 'Reunión Política Partidista', espacioId: 'esp-17', responsable: 'Organización Externa', fecha: '2026-08-17', asistentes: 150, horaInicio: '10:00', horaFin: '13:00', estado: 'rechazado' },
  { id: 'evt-77', titulo: 'Taller de Cocina Molecular', espacioId: 'esp-5', responsable: 'Br. Camilo Torres', fecha: '2026-08-19', asistentes: 20, horaInicio: '11:00', horaFin: '14:00', estado: 'rechazado' },
  { id: 'evt-78', titulo: 'Encuentro Eclesiástico Comunitario', espacioId: 'esp-13', responsable: 'Grupo Comunitario', fecha: '2026-08-22', asistentes: 120, horaInicio: '09:00', horaFin: '13:00', estado: 'rechazado' },
  { id: 'evt-79', titulo: 'Ensayo General con Pirotecnia', espacioId: 'esp-13', responsable: 'Comité de Graduación', fecha: '2026-08-26', asistentes: 80, horaInicio: '14:00', horaFin: '17:00', estado: 'rechazado' },

  // --- CANCELADOS (Aproximadamente 8%) ---
  { id: 'evt-80', titulo: 'Conferencia sobre Supercomputación', espacioId: 'esp-13', responsable: 'Prof. Nelson Bravo', fecha: '2026-07-23', asistentes: 100, horaInicio: '14:00', horaFin: '16:00', estado: 'cancelado' },
  { id: 'evt-81', titulo: 'Mantenimiento Técnico Programado', espacioId: 'esp-3', responsable: 'Coordinación de Informática', fecha: '2026-07-29', asistentes: 5, horaInicio: '08:00', horaFin: '12:00', estado: 'cancelado' },
  { id: 'evt-82', titulo: 'Taller de Reparación de Computadoras', espacioId: 'esp-7', responsable: 'Preparaduría de Hardware', fecha: '2026-08-01', asistentes: 15, horaInicio: '09:00', horaFin: '12:00', estado: 'cancelado' },
  { id: 'evt-83', titulo: 'Práctica de Química Inorgánica', espacioId: 'esp-5', responsable: 'Dr. Víctor Marcano', fecha: '2026-08-04', asistentes: 18, horaInicio: '13:00', horaFin: '16:00', estado: 'cancelado' },
  { id: 'evt-84', titulo: 'Seminario de Física Médica', espacioId: 'esp-14', responsable: 'Dpto. de Física', fecha: '2026-08-08', asistentes: 40, horaInicio: '10:00', horaFin: '12:00', estado: 'cancelado' },
  { id: 'evt-85', titulo: 'Clase Extra de Electromagnetismo', espacioId: 'esp-22', responsable: 'Prof. Mario Ortega', fecha: '2026-08-12', asistentes: 35, horaInicio: '14:00', horaFin: '16:00', estado: 'cancelado' },
  { id: 'evt-86', titulo: 'Foro sobre Energía Nuclear', espacioId: 'esp-16', responsable: 'Centro de Estudiantes Física', fecha: '2026-08-15', asistentes: 45, horaInicio: '09:00', horaFin: '12:00', estado: 'cancelado' },
  { id: 'evt-87', titulo: 'Jornada de Vacunación Universitaria', espacioId: 'esp-18', responsable: 'Servicio Médico UC', fecha: '2026-08-21', asistentes: 40, horaInicio: '08:00', horaFin: '13:00', estado: 'cancelado' },

  // --- REALIZADOS (Eventos pasados de Junio/Principios de Julio, Aprox 10%) ---
  { id: 'evt-88', titulo: 'Bienvenida a los Estudiantes de Nuevo Ingreso 2026-1', espacioId: 'esp-13', responsable: 'Decanato FaCyT', fecha: '2026-06-15', asistentes: 140, horaInicio: '09:00', horaFin: '12:00', estado: 'realizado' },
  { id: 'evt-89', titulo: 'Taller de Programación en C++', espacioId: 'esp-1', responsable: 'Prof. Carlos Martínez', fecha: '2026-06-18', asistentes: 22, horaInicio: '10:00', horaFin: '13:00', estado: 'realizado' },
  { id: 'evt-90', titulo: 'Jornada de Limpieza y Reactivación de Laboratorios', espacioId: 'esp-6', responsable: 'Dpto. de Biología', fecha: '2026-06-22', asistentes: 15, horaInicio: '08:00', horaFin: '12:00', estado: 'realizado' },
  { id: 'evt-91', titulo: 'Primer Parcial de Física I', espacioId: 'esp-19', responsable: 'Dpto. de Física', fecha: '2026-06-25', asistentes: 40, horaInicio: '08:00', horaFin: '10:00', estado: 'realizado' },
  { id: 'evt-92', titulo: 'Simposio sobre Ecología y Biodiversidad', espacioId: 'esp-15', responsable: 'Dpto. de Biología', fecha: '2026-06-29', asistentes: 45, horaInicio: '09:00', horaFin: '13:00', estado: 'realizado' },
  { id: 'evt-93', titulo: 'Charla: Seguridad en Manejo de Reactivos', espacioId: 'esp-16', responsable: 'Dpto. de Química', fecha: '2026-07-02', asistentes: 50, horaInicio: '10:00', horaFin: '12:00', estado: 'realizado' },
  { id: 'evt-94', titulo: 'Taller de Linux y Línea de Comandos', espacioId: 'esp-2', responsable: 'Preparaduría de Sistemas', fecha: '2026-07-06', asistentes: 25, horaInicio: '13:00', horaFin: '16:00', estado: 'realizado' },
  { id: 'evt-95', titulo: 'Examen de Diagnóstico de Matemáticas', espacioId: 'esp-20', responsable: 'Dpto. de Matemáticas', fecha: '2026-07-09', asistentes: 38, horaInicio: '08:00', horaFin: '10:00', estado: 'realizado' },
  { id: 'evt-96', titulo: 'Defensa de Protocolo de Tesis Doctoral', espacioId: 'esp-14', responsable: 'Coordinación de Postgrado', fecha: '2026-07-13', asistentes: 20, horaInicio: '10:00', horaFin: '12:00', estado: 'realizado' },
  { id: 'evt-97', titulo: 'Seminario de Métodos Estadísticos con R', espacioId: 'esp-7', responsable: 'Prof. Roberto Gómez', fecha: '2026-07-15', asistentes: 18, horaInicio: '09:00', horaFin: '12:00', estado: 'realizado' },
  { id: 'evt-98', titulo: 'Mesa de Trabajo: Actualización Curricular Computación', espacioId: 'esp-30', responsable: 'Dpto. de Computación', fecha: '2026-07-17', asistentes: 15, horaInicio: '09:00', horaFin: '12:00', estado: 'realizado' },
  { id: 'evt-99', titulo: 'Conferencia de Divulgación: Nanomateriales', espacioId: 'esp-15', responsable: 'Dpto. de Física', fecha: '2026-07-20', asistentes: 35, horaInicio: '10:00', horaFin: '12:00', estado: 'realizado' },
  { id: 'evt-100', titulo: 'Taller de HTML, CSS y Básico de JS', espacioId: 'esp-1', responsable: 'Centro de Estudiantes Computación', fecha: '2026-07-21', asistentes: 24, horaInicio: '13:00', horaFin: '16:00', estado: 'realizado' }
];