import { useState } from 'react';
import type { Event } from '../data/events';
import type { Spaces } from '../data/spaces';
import { useEventStore } from '../stores/useEventStore';
import { useSpaceStore } from '../stores/useSpaceStore';

export default function Submit() {
  // Consumiendo stores globales de Zustand (con persistencia en localStorage)
  const addEvent = useEventStore((state) => state.addEvent);
  const spaces = useSpaceStore((state) => state.spaces);
  const addSpace = useSpaceStore((state) => state.addSpace);

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

    // 🔴 VALIDACIÓN DE NEGOCIO: Capacidad vs Asistentes y Rango horario
    if (Number(asistentes) > espacioSeleccionado.capacidad) {
      setModalMessage({ 
        type: 'error', 
        text: `¡Aforo excedido! Has indicado ${asistentes} asistentes, pero el espacio "${espacioSeleccionado.nombre}" tiene una capacidad máxima de solo ${espacioSeleccionado.capacidad} personas.` 
      });
      return;
    }else if (horaInicio >= horaFin){
      setModalMessage({ 
        type: 'error', 
        text: `¡Rango horario incorrecto!` 
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
      estado: 'solicitado' // Todo evento entra como solicitado por defecto
    };

    // Guardamos en el store Zustand (persiste automáticamente en localStorage)
    addEvent(nuevoEvento);
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

    // Guardamos en el store Zustand (persiste automáticamente en localStorage)
    addSpace(nuevoEspacio);
    setModalMessage({ type: 'success', text: 'El nuevo espacio ha sido agregado correctamente al catálogo de la FaCyT.' });
    
    // Limpiar formulario
    setNombreEspacio(''); setCapacidad(''); setTipo('salon'); setUbicacion('');
  };

  return (
    <div className="flex gap-[15px] h-full">
      
      {/* --- PANEL IZQUIERDO: Formularios --- */}
      <section className="flex-[3_3_0%] bg-white p-5 rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e1e4e8] overflow-y-auto">
        <div className="flex gap-2.5 mb-[15px] bg-[#f8f9fa] p-1 rounded-[8px]">
          <button 
            className={`flex-1 py-2.5 px-2.5 border-none rounded-[6px] cursor-pointer font-semibold transition-all duration-200 ${
              mode === 'evento' ? 'bg-[#008b8b] text-white shadow-[0_2px_4px_rgba(0,139,139,0.3)]' : 'bg-transparent text-[#586069]'
            }`} 
            onClick={() => setMode('evento')}
          >
            📅 Nuevo Evento
          </button>
          <button 
            className={`flex-1 py-2.5 px-2.5 border-none rounded-[6px] cursor-pointer font-semibold transition-all duration-200 ${
              mode === 'espacio' ? 'bg-[#008b8b] text-white shadow-[0_2px_4px_rgba(0,139,139,0.3)]' : 'bg-transparent text-[#586069]'
            }`} 
            onClick={() => setMode('espacio')}
          >
            🏢 Nuevo Espacio
          </button>
        </div>

        {mode === 'evento' ? (
          <form onSubmit={handleRegistrarEvento}>
            <h2 className="mt-0 text-[#008b8b] text-xl font-bold mb-4">Registrar Solicitud de Evento</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5 mb-1.25 col-span-2">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Título de la Actividad</label>
                <input type="text" className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej. Defensa de Trabajo de Grado"/>
              </div>
              
              <div className="flex flex-col gap-1.5 mb-1.25 col-span-2">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Profesor / Responsable</label>
                <input type="text" className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required value={responsable} onChange={e => setResponsable(e.target.value)}/>
              </div>

              <div className="flex flex-col gap-1.5 mb-1.25">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Espacio Solicitado</label>
                <select className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required value={espacioId} onChange={e => setEspacioId(e.target.value)}>
                  <option value="">-- Seleccionar Aula --</option>
                  {spaces.map(esp => (
                    <option key={esp.id} value={esp.id}>{esp.nombre} (Cap: {esp.capacidad})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 mb-1.25">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Asistentes Esperados</label>
                <input type="number" className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required min="1" value={asistentes} onChange={e => setAsistentes(Number(e.target.value))} placeholder="Ej. 30"/>
              </div>

              <div className="flex flex-col gap-1.5 mb-1.25 col-span-2">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Fecha del Evento</label>
                <input type="date" className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required value={fecha} onChange={e => setFecha(e.target.value)}/>
              </div>

              <div className="flex flex-col gap-1.5 mb-1.25">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Hora Inicio</label>
                <input type="time" className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required value={horaInicio} onChange={e => setHoraInicio(e.target.value)}/>
              </div>

              <div className="flex flex-col gap-1.5 mb-1.25">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Hora Fin</label>
                <input type="time" className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required value={horaFin} onChange={e => setHoraFin(e.target.value)}/>
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 px-2.5 bg-[#24292e] text-white border-none rounded-[6px] text-[1.05rem] cursor-pointer font-bold mt-[15px] hover:bg-[#008b8b] transition-colors">Enviar Solicitud</button>
          </form>

        ) : (
          
          <form onSubmit={handleRegistrarEspacio}>
            <h2 className="mt-0 text-[#008b8b] text-xl font-bold mb-4">Añadir Espacio Físico</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5 mb-1.25 col-span-2">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Nombre del Espacio</label>
                <input type="text" className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required value={nombreEspacio} onChange={e => setNombreEspacio(e.target.value)} placeholder="Ej. Laboratorio Redes 2"/>
              </div>

              <div className="flex flex-col gap-1.5 mb-1.25">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Tipo</label>
                <select className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required value={tipo} onChange={e => setTipo(e.target.value as any)}>
                  <option value="laboratorio">Laboratorio</option>
                  <option value="salon">Salón de Clases</option>
                  <option value="auditorio">Auditorio</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 mb-1.25">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Capacidad (Personas)</label>
                <input type="number" className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required min="1" value={capacidad} onChange={e => setCapacidad(Number(e.target.value))}/>
              </div>

              <div className="flex flex-col gap-1.5 mb-1.25 col-span-2">
                <label className="text-[0.9rem] font-semibold text-[#24292e]">Ubicación / Piso</label>
                <input type="text" className="py-2 px-3 border border-[#d1d5da] rounded-[6px] text-[0.9rem] bg-[#f8f9fa] text-[#24292e] block w-full focus:outline-none focus:border-[#008b8b] focus:bg-white" required value={ubicacion} onChange={e => setUbicacion(e.target.value)} placeholder="Ej. Edificio Aulas, Piso 3"/>
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 px-2.5 bg-[#24292e] text-white border-none rounded-[6px] text-[1.05rem] cursor-pointer font-bold mt-[15px] hover:bg-[#008b8b] transition-colors">Guardar Espacio</button>
          </form>
        )}
      </section>

      {/* --- PANEL DERECHO: Catálogo Visual de Espacios --- */}
      <aside className="flex-[2_2_0%] flex flex-col gap-[15px] max-h-[calc(100vh-120px)] overflow-y-auto pr-1.25">
        <h3 className="m-0 text-[#24292e] text-[1.2rem] pb-[10px] border-b-2 border-[#e1e4e8] font-bold">Espacios Disponibles</h3>
        {spaces.map(espacio => {
          const borderLeftColor = 
            espacio.tipo === 'laboratorio' ? 'border-l-[#17a2b8]' : 
            espacio.tipo === 'salon' ? 'border-l-[#ffc107]' : 
            'border-l-[#6f42c1]';

          const badgeBgColor = 
            espacio.tipo === 'laboratorio' ? 'bg-[#17a2b8]' : 
            espacio.tipo === 'salon' ? 'bg-[#ffc107] text-[#24292e]' : 
            'bg-[#6f42c1]';

          return (
            <div key={espacio.id} className={`bg-white rounded-[8px] p-4 flex justify-between items-center shadow-[0_2px_5px_rgba(0,0,0,0.06)] border-l-[6px] transition-transform duration-200 hover:-translate-y-0.5 ${borderLeftColor}`}>
              <div className="space-info">
                <h4 className="m-0 mb-1 text-[#24292e] text-[1.05rem] font-bold">{espacio.nombre}</h4>
                <p className="m-0 text-[0.85rem] text-[#586069] flex items-center gap-1.25">📍 {espacio.ubicacion}</p>
                <span className={`px-2 py-0.75 rounded-full text-[0.7rem] font-bold text-white uppercase ${badgeBgColor}`}>{espacio.tipo}</span>
              </div>
              <div className="text-center bg-[#f1f8ff] py-2.5 px-3.75 rounded-[8px] border border-[#c8e1ff]">
                <span className="block text-[0.7rem] text-[#586069] font-bold">Aforo</span>
                <strong className="block text-[1.6rem] text-[#0366d6] leading-[1.1]">{espacio.capacidad}</strong>
              </div>
            </div>
          );
        })}
      </aside>

      {/* --- MODAL FLOTANTE (Validaciones) --- */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]" onClick={() => setModalMessage(null)}>
          <div className={`bg-white p-[30px] rounded-[12px] text-center max-w-[420px] w-[90%] shadow-[0_10px_25px_rgba(0,0,0,0.2)] animate-[popIn_0.3s_ease] border-t-8 ${
            modalMessage.type === 'error' ? 'border-t-[#dc3545]' : 'border-t-[#28a745]'
          }`} onClick={e => e.stopPropagation()}>
            <h3 className={`m-0 mb-[15px] text-[1.4rem] font-bold ${
              modalMessage.type === 'error' ? 'text-[#dc3545]' : 'text-[#28a745]'
            }`}>{modalMessage.type === 'error' ? '⚠️ Atención' : '✅ Operación Exitosa'}</h3>
            <p>{modalMessage.text}</p>
            <button 
              className={`mt-[20px] py-3 px-6 border-none rounded-[6px] cursor-pointer font-bold text-[1rem] text-white transition-colors ${
                modalMessage.type === 'error' ? 'bg-[#dc3545] hover:bg-[#c82333]' : 'bg-[#28a745] hover:bg-[#218838]'
              }`} 
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