import type { Event } from '../data/events';
import type { Spaces } from '../data/spaces';
import './dashboard.css'; // Importamos los estilos que acabamos de crear

interface DashboardProps {
  events: Event[];
  spaces: Spaces[];
}

export default function Dashboard({ events, spaces }: DashboardProps) {
  
  // 1. LÓGICA DE NEGOCIO: Calculamos las métricas dinámicamente
  const totalEvents = events.length;
  const solicitados = events.filter(e => e.estado === 'solicitado').length;
  const aprobados = events.filter(e => e.estado === 'aprobado').length;
  const cancelados = events.filter(e => e.estado === 'cancelado').length;

  // Función auxiliar para buscar el nombre del espacio usando su ID
  const getSpaceName = (espacioId: string) => {
    const space = spaces.find(s => s.id === espacioId);
    return space ? space.nombre : 'Por asignar';
  };

  return (
    <div className="dashboard-container">
      
      {/* PANEL IZQUIERDO: Estadísticas Globales */}
      <aside className="dashboard-summary">
        
        <div className="stat-card total">
          <h3>Eventos Totales:</h3>
          <p className="stat-number">{totalEvents}</p>
        </div>

        <div className="stat-card pending">
          <span>Solicitados:</span>
          <strong>{solicitados}</strong>
        </div>

        <div className="stat-card approved">
          <span>Aprobados:</span>
          <strong>{aprobados}</strong>
        </div>

        <div className="stat-card cancelled">
          <span>Cancelados:</span>
          <strong>{cancelados}</strong>
        </div>

        {/* Gráfico TOTALMENTE REAL y Dinámico */}
        <div className="chart-placeholder">
          <h4>Uso de Espacios</h4>
          <p>(Conteo real por aula)</p>
          <div className="mock-chart">
            {spaces.map(space => {
              // 1. Contamos cuántos eventos tiene asignados ESTE espacio específico
              const conteoEventos = events.filter(e => e.espacioId === space.id).length;
              
              // 2. Calculamos un porcentaje visual (ej. max 5 eventos para el 100% de la barra)
              const porcentajeAltura = Math.min((conteoEventos / 5) * 100, 100);

              return (
                <div 
                  key={space.id} 
                  className="bar" 
                  style={{ height: `${porcentajeAltura || 5}%` }} // Mínimo 5% si está en 0 para que sea visible
                  title={`${space.nombre}: ${conteoEventos} eventos`}
                />
              );
            })}
          </div>
        </div>

      </aside>

      {/* PANEL DERECHO: Tabla de Detalles */}
      <section className="dashboard-table-section">
        <div className="table-wrapper">
          <table className="events-table">
            
            <thead>
              <tr>
                <th>Evento</th>
                <th>Tipo</th>
                <th>Responsable</th>
                <th>Espacio</th>
                <th>Fecha/Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            
            <tbody>
              {events.map((evento) => (
                <tr key={evento.id}>
                  <td>{evento.titulo}</td>
                  {/* Como no definimos 'tipo' en la interfaz inicial, usamos un valor por defecto para el diseño */}
                  <td>Actividad</td> 
                  <td>{evento.responsable}</td>
                  <td>{getSpaceName(evento.espacioId)}</td>
                  <td>{`${evento.fecha}, ${evento.horaInicio}-${evento.horaFin}`}</td>
                  <td>
                    <span className={`status-badge ${evento.estado}`}>
                      {/* Adaptamos el texto para que coincida con tu imagen */}
                      {evento.estado === 'solicitado' ? 'En Revisión' : 
                       evento.estado === 'aprobado' ? 'Aprobado' : 'Cancelado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </section>

    </div>
  );
}