# FaCyT Event Manager 📊📅

Una aplicación web moderna (SPA) diseñada para la **Facultad de Ciencias y Tecnología (FaCyT)**, orientada a la planificación, registro y optimización de actividades académicas y eventos dentro de los espacios físicos de la institución. 

Desarrollado con un enfoque ágil, interfaces limpias y validación estricta de reglas de negocio en tiempo real.

---

## 🚀 Estado Actual del Proyecto

El sistema se encuentra en su **Fase Inicial de Prototipado Estructural**, contando con los siguientes módulos operativos y cimientos técnicos:

*   **Arquitectura Base:** Configurada como una Single Page Application (SPA) utilizando **React** y **TypeScript** para garantizar un tipado seguro y un mantenimiento óptimo del código fuente.
*   **Gestión de Estado Unificada:** El componente principal (`App.tsx`) centraliza los estados maestros de `events` (solicitudes de actividades) y `spaces` (catálogo de aulas/laboratorios), permitiendo el flujo de datos bidireccional entre vistas.
*   **Vista de Registro Dinámica (`Submit.tsx`):**
    *   **Formulario de Eventos:** Permite capturar datos clave (título, profesor responsable, fecha, horas y aforo esperado).
    *   **Formulario de Espacios:** Permite expandir dinámicamente el catálogo físico de la facultad (Aulas, Laboratorios de Computación, Auditorios).
    *   **Dashboard Visual Lateral:** Una columna derecha dedicada a mostrar los espacios disponibles, utilizando códigos de color congruentes según el tipo de aula y destacando visualmente el aforo máximo de cada una.
*   **Sistema de Alertas Centralizado:** Implementación de un modal flotante en el centro de la pantalla que notifica instantáneamente el éxito de las operaciones o errores críticos.

---

## 💡 Reglas de Negocio Implementadas (Control de Aforo)

El sistema ya cuenta con validación matemática en tiempo real en la vista de registro:
*   Si un usuario intenta agendar un evento indicando un número de asistentes que **excede la capacidad máxima** del salón seleccionado, el sistema bloquea el envío y arroja un aviso explícito en pantalla: *«¡Aforo excedido! Has indicado X asistentes, pero el espacio tiene una capacidad máxima de Y...»*

---

## 🎯 Próximos Pasos (Lo que se quiere hacer)

Para completar el alcance de la asignación y robustecer la plataforma, se avanzará en las siguientes implementaciones:

1.  **Control de Choques de Horario (Solapamiento):** Desarrollar la lógica algorítmica para evitar que dos eventos aprobados coincidan en el mismo espacio físico, la misma fecha y en rangos de horas idénticos o interceptados.
2.  **Módulo de Revisión y Flujo de Estados:** Activar la vista `Review` para permitir a la administración de la FaCyT aprobar, rechazar o sugerir cambios a las solicitudes entrantes (cambiando el estado de `solicitado` a `aprobado` o `denegado`).
3.  **Calendario Interactivo:** Integrar o estructurar la vista `Calendar` para ofrecer una visualización síncrona y mensual/semanal de las aulas ocupadas.
4.  **Reportes Estadísticos:** Implementar métricas en la vista `Reports` que detallen el porcentaje de uso de los laboratorios y los salones con mayor demanda académica.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** React (Hooks: `useState`)
*   **Lenguaje:** TypeScript (Interfaces estrictas para `Event` y `Spaces`)
*   **Estilos:** CSS3 nativo (Modularizado mediante Flexbox, CSS Grid Layout y diseño responsivo)
*   **Entorno:** Configurado idealmente para ejecución sobre sistemas Linux Mint / entornos modernos de desarrollo.

---

## 📦 Instalación y Uso

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/Gusgustav21/SIProject.git](https://github.com/Gusgustav21/SIProject.git)
