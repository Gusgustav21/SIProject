import { useState, useMemo } from 'react';
// Asegúrate de importar correctamente tus stores
import { useEventStore } from '../stores/useEventStore';
import { useSpaceStore } from '../stores/useSpaceStore';
import type { Event } from '../data/events';
import type { Spaces } from '../data/spaces';

export default function Review() {
  // --- STORES DE ZUSTAND ---
  const { events, updateEvent, deleteEvent } = useEventStore();
  const { spaces, updateSpace, deleteSpace } = useSpaceStore();

  // --- ESTADOS: Interfaz y Modales ---
  const [leftSelectedEvent, setLeftSelectedEvent] = useState<Event | null>(null);
  const [rightTab, setRightTab] = useState<'events' | 'spaces'>('events');
  const [rightSelectedItem, setRightSelectedItem] = useState<Event | Spaces | null>(null);
  const [modalMessage, setModalMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // --- ESTADOS: Filtros y Ordenamiento (Columna Derecha) ---
  const [sortBy, setSortBy] = useState<'fecha' | 'tipo'>('fecha');
  const [filterType, setFilterType] = useState<string>('all'); // 'all', 'laboratorio', 'salon', etc.

  // --- LÓGICA DE NEGOCIO: Conflictos ---
  // Revisa si un evento choca con OTRO evento específico
  const checkOverlap = (ev1: Event, ev2: Event) => {
    if (ev1.id === ev2.id) return false;
    if (ev1.espacioId !== ev2.espacioId || ev1.fecha !== ev2.fecha) return false;
    // Lógica de solapamiento de rangos de horas
    return (ev1.horaInicio < ev2.horaFin && ev1.horaFin > ev2.horaInicio);
  };

  // Revisa si un evento choca con CUALQUIER evento aprobado
  const hasConflictWithApproved = (targetEvent: Event) => {
    return events.some(e => e.estado === 'aprobado' && checkOverlap(targetEvent, e));
  };

  // Revisa si un evento choca con cualquier otro (aprobado o en revisión) para pintarlo de rojo
  const hasAnyConflict = (targetEvent: Event) => {
    return events.some(e => e.estado !== 'rechazado' && checkOverlap(targetEvent, e));
  };

  // --- DERIVACIÓN DE DATOS (Memorizada) ---
  const eventsInReview = useMemo(() => {
    return events.filter(e => e.estado === 'solicitado');
  }, [events]);

  const rightListFiltered = useMemo(() => {
    if (rightTab === 'events') {
      let list = [...events];
      // Filtrar por tipo de espacio si no es 'all'
      if (filterType !== 'all') {
        list = list.filter(e => {
          const sp = spaces.find(s => s.id === e.espacioId);
          return sp?.tipo === filterType;
        });
      }
      // Ordenar por fecha
      if (sortBy === 'fecha') {
        list.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      }
      return list;
    } else {
      let list = [...spaces];
      if (filterType !== 'all') {
        list = list.filter(s => s.tipo === filterType);
      }
      // Ordenar por tipo
      if (sortBy === 'tipo') {
        list.sort((a, b) => a.tipo.localeCompare(b.tipo));
      }
      return list;
    }
  }, [events, spaces, rightTab, filterType, sortBy]);

  // --- HANDLERS ---
  const handleApprove = (evento: Event) => {
    if (hasConflictWithApproved(evento)) {
      setModalMessage({
        type: 'error',
        text: '¡Conflicto de Horario! No puedes aprobar este evento porque coincide en fecha, hora y espacio con un evento ya aprobado.'
      });
      return;
    }
    updateEvent(evento.id, { estado: 'aprobado' });
    setLeftSelectedEvent(null);
    setModalMessage({ type: 'success', text: 'Evento aprobado con éxito.' });
  };

  const handleReject = (evento: Event) => {
    updateEvent(evento.id, { estado: 'rechazado' });
    setLeftSelectedEvent(null);
  };

  const handleDeleteRightItem = (id: string) => {
    if (rightTab === 'events') deleteEvent(id);
    else deleteSpace(id);
    setRightSelectedItem(null);
  };

  // Funciones auxiliares de UI
  const getSpaceDetails = (id: string) => spaces.find(s => s.id === id);
  
  const getCardColors = (tipo?: string) => {
    switch (tipo) {
      case 'laboratorio': return 'border-l-[#17a2b8] bg-[#eef9fa]';
      case 'salon': return 'border-l-[#ffc107] bg-[#fffcf3]';
      case 'auditorio': return 'border-l-[#6f42c1] bg-[#f5f0fa]';
      default: return 'border-l-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="flex gap-5 h-full max-h-[calc(100vh-120px)]">
      
      {/* ======================= COLUMNA IZQUIERDA: EN REVISIÓN ======================= */}
      <section className="flex-1 bg-white p-5 rounded-[12px] shadow-sm border border-[#e1e4e8] overflow-y-auto">
        <h2 className="m-0 mb-4 text-[#008b8b] text-xl font-bold border-b pb-2">📋 En Revisión</h2>
        
        <div className="flex flex-col gap-3">
          {eventsInReview.length === 0 ? (
            <p className="text-gray-500 text-center italic mt-4">No hay eventos pendientes por revisar.</p>
          ) : (
            eventsInReview.map(evento => {
              const espacio = getSpaceDetails(evento.espacioId);
              const isConflicting = hasAnyConflict(evento);

              return (
                <div 
                  key={evento.id}
                  onClick={() => setLeftSelectedEvent(evento)}
                  className={`p-4 rounded-[8px] cursor-pointer border shadow-sm transition-transform hover:-translate-y-1 ${
                    isConflicting ? 'bg-red-100 border-red-300' : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <h4 className="m-0 text-[1.1rem] font-bold text-gray-800">{evento.titulo}</h4>
                  <p className="m-0 text-[0.9rem] text-gray-600 mt-1">📍 {espacio?.nombre || 'Espacio Desconocido'}</p>
                  <p className="m-0 text-[0.85rem] font-mono text-gray-500 mt-1">
                    📅 {evento.fecha} | ⏰ {evento.horaInicio} - {evento.horaFin}
                  </p>
                  {isConflicting && (
                    <span className="text-[0.75rem] font-bold text-red-600 mt-2 block">⚠️ Coincide con otra solicitud/aprobado</span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ======================= COLUMNA DERECHA: GESTIÓN GENERAL ======================= */}
      <section className="flex-[1.5_1.5_0%] bg-white p-5 rounded-[12px] shadow-sm border border-[#e1e4e8] overflow-y-auto">
        
        {/* Toggle Listas */}
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
          <button 
            className={`flex-1 py-2 rounded-md font-bold transition-colors ${rightTab === 'events' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setRightTab('events')}
          >
            📅 Lista de Eventos
          </button>
          <button 
            className={`flex-1 py-2 rounded-md font-bold transition-colors ${rightTab === 'spaces' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setRightTab('spaces')}
          >
            🏢 Lista de Espacios
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-4">
          <select className="border p-2 rounded-md text-sm flex-1" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">Todos los Tipos</option>
            <option value="laboratorio">Laboratorio</option>
            <option value="salon">Salón de Clases</option>
            <option value="auditorio">Auditorio</option>
          </select>
          <select className="border p-2 rounded-md text-sm flex-1" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="fecha">Ordenar por Fecha</option>
            <option value="tipo">Ordenar por Tipo</option>
          </select>
        </div>

        {/* Lista */}
        <div className="grid grid-cols-2 gap-3">
          {rightListFiltered.map(item => {
            const isEvent = rightTab === 'events';
            const evento = isEvent ? item as Event : null;
            const espacio = isEvent ? getSpaceDetails(evento!.espacioId) : item as Spaces;
            
            const cardColors = getCardColors(espacio?.tipo);

            return (
              <div 
                key={item.id}
                onClick={() => setRightSelectedItem(item)}
                className={`p-3 rounded-lg cursor-pointer border-l-[6px] shadow-sm hover:shadow-md transition-shadow ${cardColors}`}
              >
                <strong className="block text-gray-800">{isEvent ? evento!.titulo : espacio!.nombre}</strong>
                {isEvent && (
                  <span className={`text-[0.7rem] px-2 py-0.5 rounded-full text-white ${
                    evento!.estado === 'aprobado' ? 'bg-green-600' : evento!.estado === 'rechazado' ? 'bg-red-600' : 'bg-yellow-500'
                  }`}>
                    {evento!.estado.toUpperCase()}
                  </span>
                )}
                {!isEvent && <span className="text-sm text-gray-600">Cap: {espacio!.capacidad}</span>}
              </div>
            )
          })}
        </div>
      </section>

      {/* ======================= MODAL: REVISAR EVENTO (Izquierda) ======================= */}
      {leftSelectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={() => setLeftSelectedEvent(null)}>
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-[500px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{leftSelectedEvent.titulo}</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 space-y-2 text-sm text-gray-700">
              <p><strong>Responsable:</strong> {leftSelectedEvent.responsable}</p>
              <p><strong>Espacio:</strong> {getSpaceDetails(leftSelectedEvent.espacioId)?.nombre}</p>
              <p><strong>Fecha:</strong> {leftSelectedEvent.fecha}</p>
              <p><strong>Horario:</strong> {leftSelectedEvent.horaInicio} - {leftSelectedEvent.horaFin}</p>
            </div>
            
            <div className="flex gap-3 mt-5">
              <button onClick={() => handleApprove(leftSelectedEvent)} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition">✅ Aprobar</button>
              <button onClick={() => handleReject(leftSelectedEvent)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-bold hover:bg-red-700 transition">❌ Rechazar</button>
              <button onClick={() => setLeftSelectedEvent(null)} className="flex-1 bg-gray-300 text-gray-800 py-2.5 rounded-lg font-bold hover:bg-gray-400 transition">Volver</button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: GESTIÓN (Derecha) ======================= */}
      {rightSelectedItem && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={() => setRightSelectedItem(null)}>
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-[400px] shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Opciones para {rightTab === 'events' ? (rightSelectedItem as Event).titulo : (rightSelectedItem as Spaces).nombre}
            </h3>
            <div className="flex flex-col gap-2">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">✏️ Editar (Próximamente)</button>
              <button onClick={() => handleDeleteRightItem(rightSelectedItem.id)} className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700">🗑️ Borrar Permanente</button>
              <button onClick={() => setRightSelectedItem(null)} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-300 mt-2">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL DE ALERTA (Global) ======================= */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60]" onClick={() => setModalMessage(null)}>
          <div className={`bg-white p-6 rounded-xl w-[90%] max-w-[400px] shadow-2xl text-center border-t-8 ${modalMessage.type === 'error' ? 'border-red-500' : 'border-green-500'}`} onClick={e => e.stopPropagation()}>
            <h3 className={`text-xl font-bold mb-3 ${modalMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {modalMessage.type === 'error' ? '⚠️ Acción Denegada' : '✅ Éxito'}
            </h3>
            <p className="text-gray-700">{modalMessage.text}</p>
            <button onClick={() => setModalMessage(null)} className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900">Entendido</button>
          </div>
        </div>
      )}

    </div>
  );
}