import { useState } from 'react';
import type { Event } from '../data/events';
import type { Spaces } from '../data/spaces';
import { useEventStore } from '../stores/useEventStore';
import { useSpaceStore } from '../stores/useSpaceStore';

export default function Submit() {
  const addEvent = useEventStore((state) => state.addEvent);
  const spaces = useSpaceStore((state) => state.spaces);
  const addSpace = useSpaceStore((state) => state.addSpace);

  const [mode, setMode] = useState<'evento' | 'espacio'>('evento');
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

  const handleRegistrarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    const espacioSeleccionado = spaces.find(s => s.id === espacioId);

    if (!espacioSeleccionado) {
      setModalMessage({ type: 'error', text: 'Por favor, selecciona un espacio de la lista.' });
      return;
    }

    if (Number(asistentes) > espacioSeleccionado.capacidad) {
      setModalMessage({ 
        type: 'error', 
        text: `¡Aforo excedido! Has indicado ${asistentes} asistentes, pero el espacio "${espacioSeleccionado.nombre}" tiene una capacidad máxima de solo ${espacioSeleccionado.capacidad} personas.` 
      });
      return;
    } else if (horaInicio >= horaFin) {
      setModalMessage({ 
        type: 'error', 
        text: `¡Rango horario incorrecto! La hora de inicio debe ser anterior a la hora final.` 
      });
      return;
    }

    const nuevoEvento: Event = {
      id: `evt-${Date.now()}`,
      titulo,
      espacioId,
      responsable,
      fecha,
      asistentes: Number(asistentes),
      horaInicio,
      horaFin,
      estado: 'solicitado'
    };

    addEvent(nuevoEvento);
    setModalMessage({ type: 'success', text: 'Evento registrado con éxito. Se encuentra "En Revisión".' });
    
    setTitulo(''); setEspacioId(''); setResponsable(''); setAsistentes(''); setFecha(''); setHoraInicio(''); setHoraFin('');
  };

  const handleRegistrarEspacio = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoEspacio: Spaces = {
      id: `esp-${Date.now()}`,
      nombre: nombreEspacio,
      capacidad: Number(capacidad),
      tipo,
      ubicacion
    };

    addSpace(nuevoEspacio);
    setModalMessage({ type: 'success', text: 'El nuevo espacio ha sido agregado correctamente al catálogo de la FaCyT.' });
    
    setNombreEspacio(''); setCapacidad(''); setTipo('salon'); setUbicacion('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      
      {/* --- PANEL IZQUIERDO: Formularios --- */}
      <section className="flex-[3] bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-y-auto">
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
          <button 
            type="button"
            className={`flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'evento' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`} 
            onClick={() => setMode('evento')}
          >
            📅 Nuevo Evento
          </button>
          <button 
            type="button"
            className={`flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'espacio' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`} 
            onClick={() => setMode('espacio')}
          >
            🏢 Nuevo Espacio
          </button>
        </div>

        {mode === 'evento' ? (
          <form onSubmit={handleRegistrarEvento} className="space-y-4">
            <div>
              <h2 className="text-slate-800 text-lg font-bold">Registrar Solicitud de Evento</h2>
              <p className="text-slate-400 text-xs">Completa los datos requeridos para solicitar un espacio</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Título de la Actividad</label>
                <input 
                  type="text" 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  value={titulo} 
                  onChange={e => setTitulo(e.target.value)} 
                  placeholder="Ej. Defensa de Trabajo de Grado"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Profesor / Responsable</label>
                <input 
                  type="text" 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  value={responsable} 
                  onChange={e => setResponsable(e.target.value)}
                  placeholder="Ej. Prof. García"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Espacio Solicitado</label>
                <select 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  value={espacioId} 
                  onChange={e => setEspacioId(e.target.value)}
                >
                  <option value="">-- Seleccionar Aula --</option>
                  {spaces.map(esp => (
                    <option key={esp.id} value={esp.id}>{esp.nombre} (Cap: {esp.capacidad})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Asistentes Esperados</label>
                <input 
                  type="number" 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  min="1" 
                  value={asistentes} 
                  onChange={e => setAsistentes(Number(e.target.value))} 
                  placeholder="Ej. 30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Fecha del Evento</label>
                <input 
                  type="date" 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  value={fecha} 
                  onChange={e => setFecha(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Hora Inicio</label>
                <input 
                  type="time" 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  value={horaInicio} 
                  onChange={e => setHoraInicio(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Hora Fin</label>
                <input 
                  type="time" 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  value={horaFin} 
                  onChange={e => setHoraFin(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer mt-2"
            >
              Enviar Solicitud
            </button>
          </form>

        ) : (
          
          <form onSubmit={handleRegistrarEspacio} className="space-y-4">
            <div>
              <h2 className="text-slate-800 text-lg font-bold">Añadir Espacio Físico</h2>
              <p className="text-slate-400 text-xs">Crea un nuevo espacio disponible en el catálogo</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del Espacio</label>
                <input 
                  type="text" 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  value={nombreEspacio} 
                  onChange={e => setNombreEspacio(e.target.value)} 
                  placeholder="Ej. Laboratorio Redes 2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tipo</label>
                <select 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  value={tipo} 
                  onChange={e => setTipo(e.target.value as any)}
                >
                  <option value="laboratorio">Laboratorio</option>
                  <option value="salon">Salón de Clases</option>
                  <option value="auditorio">Auditorio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Capacidad (Personas)</label>
                <input 
                  type="number" 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  min="1" 
                  value={capacidad} 
                  onChange={e => setCapacidad(Number(e.target.value))}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Ubicación / Piso</label>
                <input 
                  type="text" 
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-cyan-500 transition-colors" 
                  required 
                  value={ubicacion} 
                  onChange={e => setUbicacion(e.target.value)} 
                  placeholder="Ej. Edificio Aulas, Piso 3"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer mt-2"
            >
              Guardar Espacio
            </button>
          </form>
        )}
      </section>

      {/* --- PANEL DERECHO: Catálogo Visual de Espacios --- */}
      <aside className="flex-[2] flex flex-col gap-3 max-h-[calc(100vh-120px)] overflow-y-auto">
        <h3 className="m-0 text-slate-800 text-sm font-bold pb-2 border-b border-slate-200">
          Espacios Disponibles ({spaces.length})
        </h3>

        {spaces.map(espacio => {
          const borderLeftColor = 
            espacio.tipo === 'laboratorio' ? 'border-l-cyan-500' : 
            espacio.tipo === 'salon' ? 'border-l-amber-500' : 
            'border-l-indigo-500';

          const badgeBgColor = 
            espacio.tipo === 'laboratorio' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 
            espacio.tipo === 'salon' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
            'bg-indigo-50 text-indigo-700 border-indigo-200';

          return (
            <div 
              key={espacio.id} 
              className={`bg-white rounded-xl p-4 flex justify-between items-center shadow-xs border-y border-r border-slate-200 border-l-4 transition-all hover:translate-x-1 ${borderLeftColor}`}
            >
              <div>
                <h4 className="m-0 mb-1 text-slate-800 text-sm font-bold">{espacio.nombre}</h4>
                <p className="m-0 text-xs text-slate-500 flex items-center gap-1 mb-2">
                  📍 {espacio.ubicacion}
                </p>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase ${badgeBgColor}`}>
                  {espacio.tipo}
                </span>
              </div>

              <div className="text-center bg-slate-50 py-2 px-3 rounded-lg border border-slate-200/80 shrink-0">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Aforo</span>
                <strong className="block text-xl text-slate-800 font-black leading-tight">{espacio.capacidad}</strong>
              </div>
            </div>
          );
        })}
      </aside>

      {/* --- MODAL FLOTANTE (Validaciones) --- */}
      {modalMessage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4" onClick={() => setModalMessage(null)}>
          <div 
            className={`bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl border-t-4 text-center ${
              modalMessage.type === 'error' ? 'border-t-rose-500' : 'border-t-emerald-500'
            }`} 
            onClick={e => e.stopPropagation()}
          >
            <h3 className={`text-base font-bold mb-2 ${modalMessage.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {modalMessage.type === 'error' ? '⚠️ Atención' : '✅ Operación Exitosa'}
            </h3>
            <p className="text-xs text-slate-600">{modalMessage.text}</p>
            <button 
              className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
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