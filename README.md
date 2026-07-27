# FaCyT Event Manager 📊📅

Una aplicación web moderna (SPA) diseñada para la **Facultad de Ciencias y Tecnología (FaCyT)** de la Universidad de Carabobo, orientada a la planificación, registro, optimización y seguimiento de actividades académicas y eventos dentro de los espacios físicos de la institución.

El sistema articula personas, procesos, datos y tecnología para transformar la gestión organizacional de la facultad, garantizando la trazabilidad del proceso de aprobación y optimizando el uso de sus recursos.

---

## 👥 Equipo de Desarrollo

* **Institución:** Universidad de Carabobo - Facultad Experimental de Ciencias y Tecnología (FaCyT) - Departamento de Computación (Sistemas de Información)
* **Profesora:** Marylin Giugni
* **Estudiantes:** Anthony Quero, Gustavo Rivas
* **Fecha:** 24 de julio de 2026

---

## 🚀 Estado Actual del Proyecto

El sistema ha superado la fase de prototipado inicial y cuenta con un **Sistema de Información Web Funcional e Integral**, estructurado sobre los siguientes componentes y módulos operativos:

* **Arquitectura Base (SPA):** Construida con **React**, **TypeScript** y **Vite**, asegurando un tipado estricto, alto rendimiento en la navegación y mantenimiento escalable del código fuente.
* **Backend y Persistencia:** Integración con **MongoDB** para el almacenamiento y conservación de datos (usuarios, eventos y espacios).
* **Gestión de Autenticación y Roles:** Sistema de login y registro de cuentas (correo, contraseña y nombre) con manejo de roles diferenciados:
  * **Administrador (Admin):** Supervisión global, creación/edición de espacios, revisión de solicitudes (aprobación/rechazo) y modificación de eventos.
  * **Usuario Regular:** Propuesta de eventos, consulta de programación e interacción mediante feedback en eventos finalizados.
  * **Alternancia Rápida:** Funcionalidad de cambio rápido de usuario dentro de la interfaz para facilitar pruebas y gestión.

---

## ⚙️ Funcionalidades y Módulos Implementados

### 1. Registro de Solicitudes y Espacios (`Submit.tsx`)
* **Captura de Datos del Evento:** Formulario dinámico para registrar título, responsable, fecha, horarios y asistencia esperada.
* **Gestión de Espacios:** Módulo para expandir el catálogo físico de la facultad (Aulas, Laboratorios de Computación, Auditorios) especificando nombre, tipo, capacidad y ubicación.
* **Visualización Dinámica:** Panel lateral que lista los espacios disponibles con códigos de color según su tipo y resalta la capacidad máxima.

### 2. Control Lógico y Reglas de Negocio
* **Validación de Aforo en Tiempo Real:** Bloqueo automático e inmediato si la asistencia esperada supera la capacidad máxima del espacio seleccionado.
* **Detección Lógica y Visual de Conflictos de Horario:** Algoritmo que detecta choques de fecha, rango de horas y espacio físico. En el panel de administración se resaltan en color rojo y el sistema **impide la aprobación** si existe coincidencia con un evento ya aprobado.

### 3. Módulo de Revisión y Gestión de Estados (`Review.tsx`)
* Flujo de estados para la trazabilidad de la solicitud (`solicitado` / `en revisión` $\rightarrow$ `aprobado` / `rechazado`).
* Toma de decisiones centralizada por parte del Administrador para aprobar, rechazar o editar información.

### 4. Dashboard de Gestión y Métricas
* Resumen cuantitativo en tiempo real de eventos por estado (totales, aprobados, pendientes, etc.).
* Visualización gráfica mediante barras del porcentaje y nivel de ocupación de los espacios de la facultad.

### 5. Reportes e Interacción de Usuarios (`Reports.tsx`)
* Listado cronológico de eventos ejecutados.
* Indicadores clave de rendimiento (espacio más utilizado y espacio mejor calificado).
* **Retroalimentación y Calificación:** Sistema de valoración (1 a 5 estrellas) y comentarios por parte de los usuarios sobre las actividades realizadas.

---

## 🤖 Uso Declarado de Inteligencia Artificial & Ética

* **Herramienta:** Gemini (Google - Versión de navegador).
* **Propósito:** Asistencia técnica en la construcción del frontend, estructuración de componentes React, diseño responsivo y maquetación con TailwindCSS.
* **Supervisión Humana:** La IA actuó únicamente como apoyo de desarrollo. Toda la lógica de negocio (detección de choques, validaciones de aforo y criterios de aprobación) fue diseñada, supervisada y corregida manualmente por el equipo.
* **Decisiones Éticas:** Mantenimiento del control humano obligatorio en las decisiones institucionales (la aprobación de eventos nunca se delega automáticamente a algoritmos/IA) y resguardo de la privacidad de credenciales dentro del entorno del sistema.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React, TypeScript, TailwindCSS, Vite.
* **Backend / Base de Datos:** MongoDB.
* **Herramientas de Apoyo:** Google Gemini (Asistencia en Frontend).
* **Entorno de Desarrollo:** Linux Mint / Entornos Web Modernos.

---

## 🎯 Alcance, Limitaciones y Mejoras Futuras

### Alcance Actual (Incluido)
* Autenticación, roles (Admin/User), registro y edición de eventos y espacios.
* Validaciones strictly de aforo y prevención de solapamientos de horario.
* Dashboard analítico, módulo de reportes y calificaciones post-evento.

### Excluido del Alcance Actual
* Notificaciones externas vía correo o SMS.
* Integración de pasarelas de pago o venta de entradas.
* Sincronización automática con calendarios externos (Google Calendar, Outlook, etc.).

### Mejoras Futuras
1. **Calendario Interactivo:** Vista mensual/semanal interactiva para la programación visual de espacios.
2. **Generación de Certificados:** Emisión automática de constancias de asistencia para eventos concluidos.
3. **Notificaciones Push:** Sistema interno de alertas en tiempo real sobre cambios de estado en las solicitudes.

---

## 📦 Instalación y Uso

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/Gusgustav21/SIProject.git](https://github.com/Gusgustav21/SIProject.git)
   cd SIProject