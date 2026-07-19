import { useState } from 'react';
import type { Event } from '../data/events';
import type { Spaces } from '../data/spaces';
import './submit.css';

interface SubmitProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  spaces: Spaces[];
  setSpaces: React.Dispatch<React.SetStateAction<Spaces[]>>;
}

export default function Submit({ events, setEvents, spaces, setSpaces }: SubmitProps) {
  // Selector para saber qué formulario mostrar
  const [mode, setMode] = useState<'evento' | 'espacio'>('evento');
  
  // Estado para el mensaje flotante (Modal)
  const [modalMessage, setModalMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // --- ESTADOS: Formulario de Evento ---
  const [titulo, setTitulo] = useState('');
  const [espacioId, setEspacioId] = useState('');
  const [responsable, setResponsable] = useState('');
  const [asistentes, setAsistentes] = useState<number | ''>('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  // --- ESTADOS: Formulario de Nuevo Espacio ---
  const [nombreEspacio, setNombreEspacio] = useState('');
  const [capacidad, setCapacidad] = useState<number | ''>('');
  const [tipo, setTipo] = useState<'laboratorio' | 'salon' | 'auditorio'>('salon');
  const [ubicacion, setUbicacion] = useState('');

  // Lógica para enviar Evento
  const handleRegistrarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    const espacioSeleccionado = spaces.find(s => s.id === espacioId);

    if (!espacioSeleccionado) {
      setModalMessage({ type: 'error', text: 'Por favor, selecciona un espacio de la lista.' });
      return;
    }

    // 🔴 VALIDACIÓN DE NEGOCIO: Capacidad vs Asistentes
    if (Number(asistentes) > espacioSeleccionado.capacidad) {
      setModalMessage({ 
        type: 'error', 
        text: `¡Aforo excedido! Has indicado ${asistentes} asistentes, pero el espacio "${espacioSeleccionado.nombre}" tiene una capacidad máxima de solo ${espacioSeleccionado.capacidad} personas.` 
      });
      return;
    }

    const nuevoEvento: Event = {
      id: `evt-${Date.now()}`,
      titulo,
      espacioId,
      responsable,
      fecha,
      horaInicio,
      horaFin,
      estado: 'solicitado' // Todo evento entra como solicitado por defecto
    };

    setEvents([...events, nuevoEvento]);
    setModalMessage({ type: 'success', text: 'Evento registrado con éxito. Se encuentra "En Revisión".' });
    
    // Limpiar formulario
    setTitulo(''); setEspacioId(''); setResponsable(''); setAsistentes(''); setFecha(''); setHoraInicio(''); setHoraFin('');
  };

  // Lógica para enviar Espacio
  const handleRegistrarEspacio = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoEspacio: Spaces = {
      id: `esp-${Date.now()}`,
      nombre: nombreEspacio,
      capacidad: Number(capacidad),
      tipo,
      ubicacion
    };

    setSpaces([...spaces, nuevoEspacio]);
    setModalMessage({ type: 'success', text: 'El nuevo espacio ha sido agregado correctamente al catálogo de la FaCyT.' });
    
    // Limpiar formulario
    setNombreEspacio(''); setCapacidad(''); setTipo('salon'); setUbicacion('');
  };

  return (
    <div className="submit-container">
      
      {/* --- PANEL IZQUIERDO: Formularios --- */}
      <section className="form-section">
        <div className="toggle-group">
          <button className={`toggle-btn ${mode === 'evento' ? 'active' : ''}`} onClick={() => setMode('evento')}>
            📅 Nuevo Evento
          </button>
          <button className={`toggle-btn ${mode === 'espacio' ? 'active' : ''}`} onClick={() => setMode('espacio')}>
            🏢 Nuevo Espacio
          </button>
        </div>

        {mode === 'evento' ? (
          <form onSubmit={handleRegistrarEvento}>
            <h2 style={{marginTop: 0, color: '#008b8b'}}>Registrar Solicitud de Evento</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Título de la Actividad</label>
                <input type="text" className="form-control" required value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej. Defensa de Trabajo de Grado"/>
              </div>
              
              <div className="form-group full-width">
                <label>Profesor / Responsable</label>
                <input type="text" className="form-control" required value={responsable} onChange={e => setResponsable(e.target.value)}/>
              </div>

              <div className="form-group">
                <label>Espacio Solicitado</label>
                <select className="form-control" required value={espacioId} onChange={e => setEspacioId(e.target.value)}>
                  <option value="">-- Seleccionar Aula --</option>
                  {spaces.map(esp => (
                    <option key={esp.id} value={esp.id}>{esp.nombre} (Cap: {esp.capacidad})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Asistentes Esperados</label>
                <input type="number" className="form-control" required min="1" value={asistentes} onChange={e => setAsistentes(Number(e.target.value))} placeholder="Ej. 30"/>
              </div>

              <div className="form-group full-width">
                <label>Fecha del Evento</label>
                <input type="date" className="form-control" required value={fecha} onChange={e => setFecha(e.target.value)}/>
              </div>

              <div className="form-group">
                <label>Hora Inicio</label>
                <input type="time" className="form-control" required value={horaInicio} onChange={e => setHoraInicio(e.target.value)}/>
              </div>

              <div className="form-group">
                <label>Hora Fin</label>
                <input type="time" className="form-control" required value={horaFin} onChange={e => setHoraFin(e.target.value)}/>
              </div>
            </div>
            <button type="submit" className="submit-btn">Enviar Solicitud</button>
          </form>

        ) : (
          
          <form onSubmit={handleRegistrarEspacio}>
            <h2 style={{marginTop: 0, color: '#008b8b'}}>Añadir Espacio Físico</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Nombre del Espacio</label>
                <input type="text" className="form-control" required value={nombreEspacio} onChange={e => setNombreEspacio(e.target.value)} placeholder="Ej. Laboratorio Redes 2"/>
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select className="form-control" required value={tipo} onChange={e => setTipo(e.target.value as any)}>
                  <option value="laboratorio">Laboratorio</option>
                  <option value="salon">Salón de Clases</option>
                  <option value="auditorio">Auditorio</option>
                </select>
              </div>

              <div className="form-group">
                <label>Capacidad (Personas)</label>
                <input type="number" className="form-control" required min="1" value={capacidad} onChange={e => setCapacidad(Number(e.target.value))}/>
              </div>

              <div className="form-group full-width">
                <label>Ubicación / Piso</label>
                <input type="text" className="form-control" required value={ubicacion} onChange={e => setUbicacion(e.target.value)} placeholder="Ej. Edificio Aulas, Piso 3"/>
              </div>
            </div>
            <button type="submit" className="submit-btn">Guardar Espacio</button>
          </form>
        )}
      </section>

      {/* --- PANEL DERECHO: Catálogo Visual de Espacios --- */}
      <aside className="spaces-section">
        <h3 className="spaces-header">Espacios Disponibles</h3>
        {spaces.map(espacio => (
          <div key={espacio.id} className={`space-card ${espacio.tipo}`}>
            <div className="space-info">
              <h4>{espacio.nombre}</h4>
              <p>📍 {espacio.ubicacion}</p>
              <span className={`badge ${espacio.tipo}`}>{espacio.tipo}</span>
            </div>
            <div className="space-capacity">
              <span>Aforo</span>
              <strong>{espacio.capacidad}</strong>
            </div>
          </div>
        ))}
      </aside>

      {/* --- MODAL FLOTANTE (Validaciones) --- */}
      {modalMessage && (
        <div className="modal-overlay" onClick={() => setModalMessage(null)}>
          <div className={`modal-content ${modalMessage.type}`} onClick={e => e.stopPropagation()}>
            <h3>{modalMessage.type === 'error' ? '⚠️ Atención' : '✅ Operación Exitosa'}</h3>
            <p>{modalMessage.text}</p>
            <button 
              className={`modal-btn ${modalMessage.type}`} 
              onClick={() => setModalMessage(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}