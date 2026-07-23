import { useState, useMemo } from 'react';
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

  // --- ESTADOS: Edición de Evento ---
  const [isEditing, setIsEditing] = useState(false);
  const [editEspacioId, setEditEspacioId] = useState('');
  const [editFecha, setEditFecha] = useState('');
  const [editHoraInicio, setEditHoraInicio] = useState('');
  const [editHoraFin, setEditHoraFin] = useState('');
  const [editAsistentes, setEditAsistentes] = useState<number | ''>('');

  // --- ESTADOS: Filtros y Ordenamiento (CAMBIO 1: Se añade 'estado') ---
  const [sortBy, setSortBy] = useState<'fecha' | 'tipo' | 'estado'>('fecha');
  const [filterType, setFilterType] = useState<string>('all');

  // --- LÓGICA DE NEGOCIO: Conflictos ---
  const checkOverlap = (ev1: Event, ev2: Event) => {
    if (ev1.id === ev2.id) return false;
    if (ev1.espacioId !== ev2.espacioId || ev1.fecha !== ev2.fecha) return false;
    return (ev1.horaInicio < ev2.horaFin && ev1.horaFin > ev2.horaInicio);
  };

  const hasConflictWithApproved = (targetEvent: Event) => {
    return events.some(e => e.estado === 'aprobado' && checkOverlap(targetEvent, e));
  };

  const hasAnyConflict = (targetEvent: Event) => {
    return events.some(
      e => e.estado !== 'rechazado' && e.estado !== 'cancelado' && checkOverlap(targetEvent, e)
    );
  };

  // --- DERIVACIÓN DE DATOS ---
  const eventsInReview = useMemo(() => {
    return events.filter(e => e.estado === 'solicitado');
  }, [events]);

  const rightListFiltered = useMemo(() => {
    if (rightTab === 'events') {
      let list = [...events];

      list = list.filter(e => e.estado !== 'solicitado'); //No muestra eventos solicitados

      if (filterType !== 'all') {
        list = list.filter(e => {
          const sp = spaces.find(s => s.id === e.espacioId);
          return sp?.tipo === filterType;
        });
      }
      
      // CAMBIO 2: Lógica de ordenamiento para eventos
      if (sortBy === 'fecha') {
        list.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      } else if (sortBy === 'estado') {
        const orderPriority: Record<string, number> = {
          solicitado: 1,
          aprobado: 2,
          realizado: 3,
          cancelado: 4,
          rechazado: 5,
        };
        list.sort((a, b) => (orderPriority[a.estado] || 99) - (orderPriority[b.estado] || 99));
      }

      return list;
    } else {
      let list = [...spaces];
      if (filterType !== 'all') {
        list = list.filter(s => s.tipo === filterType);
      }
      if (sortBy === 'tipo') {
        list.sort((a, b) => a.tipo.localeCompare(b.tipo));
      }
      return list;
    }
  }, [events, spaces, rightTab, filterType, sortBy]);

  // --- HANDLERS ---
  const handleSelectRightItem = (item: Event | Spaces) => {
    setRightSelectedItem(item);
    setIsEditing(false);

    if (rightTab === 'events') {
      const ev = item as Event;
      setEditEspacioId(ev.espacioId);
      setEditFecha(ev.fecha);
      setEditHoraInicio(ev.horaInicio);
      setEditHoraFin(ev.horaFin);
      setEditAsistentes(ev.asistentes ?? '');
    }
  };

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

  const handleCancelEvent = (evento: Event) => {
    updateEvent(evento.id, { estado: 'cancelado' });
    setRightSelectedItem(null);
    setModalMessage({ type: 'success', text: 'El evento ha sido marcado como cancelado.' });
  };

  const handleSaveEdit = (evento: Event) => {
    if (editHoraInicio >= editHoraFin) {
      setModalMessage({
        type: 'error',
        text: '¡Rango horario incorrecto! La hora de inicio debe ser menor a la hora de fin.'
      });
      return;
    }

    const selectedSpace = spaces.find(s => s.id === editEspacioId);
    const numAsistentes = editAsistentes === '' ? (evento.asistentes || 0) : Number(editAsistentes);

    if (selectedSpace && numAsistentes > selectedSpace.capacidad) {
      setModalMessage({
        type: 'error',
        text: `¡Capacidad excedida! El espacio "${selectedSpace.nombre}" tiene capacidad para ${selectedSpace.capacidad} personas, pero la asistencia esperada es de ${numAsistentes}.`
      });
      return;
    }

    const updatedTempEvent: Event = {
      ...evento,
      espacioId: editEspacioId,
      fecha: editFecha,
      horaInicio: editHoraInicio,
      horaFin: editHoraFin,
      asistentes: numAsistentes
    };

    const hasConflict = events.some(
      e => e.id !== evento.id && e.estado === 'aprobado' && checkOverlap(updatedTempEvent, e)
    );

    if (hasConflict) {
      setModalMessage({
        type: 'error',
        text: '¡Conflicto de Horario! La nueva fecha, hora y espacio chocan con un evento ya aprobado.'
      });
      return;
    }

    updateEvent(evento.id, {
      espacioId: editEspacioId,
      fecha: editFecha,
      horaInicio: editHoraInicio,
      horaFin: editHoraFin,
      asistentes: numAsistentes
    });

    setIsEditing(false);
    setRightSelectedItem(null);
    setModalMessage({ type: 'success', text: 'Información del evento actualizada correctamente.' });
  };

  const handleDeleteRightItem = (item: Event | Spaces) => {
    if (rightTab === 'spaces') {
      const hasAssociatedEvents = events.some(e => e.espacioId === item.id);
      if (hasAssociatedEvents) {
        setModalMessage({
          type: 'error',
          text: `No se puede eliminar el espacio. Actualmente existen eventos asociados a este espacio.`
        });
        setRightSelectedItem(null);
        return;
      }
    }

    const nombreItem = rightTab === 'events' ? (item as Event).titulo : (item as Spaces).nombre;
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente "${nombreItem}"?`);

    if (!confirmDelete) return;

    if (rightTab === 'events') {
      deleteEvent(item.id);
      setModalMessage({ type: 'success', text: 'Evento eliminado correctamente.' });
    } else {
      deleteSpace(item.id);
      setModalMessage({ type: 'success', text: 'Espacio eliminado correctamente.' });
    }

    setRightSelectedItem(null);
  };

  const getSpaceDetails = (id: string) => spaces.find(s => s.id === id);
  
  const getCardBorderColor = (tipo?: string) => {
    switch (tipo) {
      case 'laboratorio': return 'border-l-cyan-500';
      case 'salon': return 'border-l-amber-500';
      case 'auditorio': return 'border-l-indigo-500';
      default: return 'border-l-slate-400';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full max-h-[calc(100vh-120px)]">
      
      {/* ======================= COLUMNA IZQUIERDA: EN REVISIÓN ======================= */}
      <section className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <span className="text-xl">📋</span>
          <h2 className="m-0 text-slate-800 text-lg font-bold">En Revisión</h2>
          <span className="ml-auto bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {eventsInReview.length} pendientes
          </span>
        </div>
        
        <div className="flex flex-col gap-3">
          {eventsInReview.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm italic">
              No hay solicitudes pendientes por revisar.
            </div>
          ) : (
            eventsInReview.map(evento => {
              const espacio = getSpaceDetails(evento.espacioId);
              const isConflicting = hasAnyConflict(evento);

              return (
                <div 
                  key={evento.id}
                  onClick={() => setLeftSelectedEvent(evento)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all hover:shadow-md ${
                    isConflicting 
                      ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300' 
                      : 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="m-0 text-sm font-bold text-slate-800">{evento.titulo}</h4>
                  </div>
                  <p className="m-0 text-xs text-slate-600 flex items-center gap-1 mt-1">
                    📍 {espacio?.nombre || 'Espacio Desconocido'}
                  </p>
                  <p className="m-0 text-xs font-medium text-slate-500 mt-1">
                    📅 {evento.fecha} &nbsp;|&nbsp; ⏰ {evento.horaInicio} - {evento.horaFin}
                  </p>
                  {isConflicting && (
                    <span className="text-[11px] font-semibold text-rose-600 mt-2 flex items-center gap-1">
                      ⚠️ Coincide con otra solicitud o evento aprobado
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ======================= COLUMNA DERECHA: GESTIÓN GENERAL ======================= */}
      <section className="flex-[1.5] bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-y-auto">
        
        {/* Toggle Listas */}
        <div className="flex gap-1.5 mb-4 bg-slate-100 p-1 rounded-xl">
          <button 
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              rightTab === 'events' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => { setRightTab('events'); setRightSelectedItem(null); }}
          >
            📅 Eventos ({events.length})
          </button>
          <button 
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              rightTab === 'spaces' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => { setRightTab('spaces'); setRightSelectedItem(null); }}
          >
            🏢 Espacios ({spaces.length})
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 flex-1 focus:outline-none focus:border-cyan-500" 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="all">Todos los tipos de espacio</option>
            <option value="laboratorio">Laboratorio</option>
            <option value="salon">Salón de Clases</option>
            <option value="auditorio">Auditorio</option>
          </select>

          {/* CAMBIO 3: Opciones de ordenamiento en el select */}
          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 flex-1 focus:outline-none focus:border-cyan-500" 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value as any)}
          >
            {rightTab === 'events' ? (
              <>
                <option value="fecha">Ordenar por Fecha</option>
                <option value="estado">Ordenar por Estado</option>
              </>
            ) : (
              <option value="tipo">Ordenar por Tipo</option>
            )}
          </select>
        </div>

        {/* Grilla de Elementos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rightListFiltered.map(item => {
            const isEvent = rightTab === 'events';
            const evento = isEvent ? item as Event : null;
            const espacio = isEvent ? getSpaceDetails(evento!.espacioId) : item as Spaces;
            const cardBorder = getCardBorderColor(espacio?.tipo);

            return (
              <div 
                key={item.id}
                onClick={() => handleSelectRightItem(item)}
                className={`p-3.5 bg-slate-50/50 hover:bg-slate-100/80 rounded-xl cursor-pointer border-y border-r border-slate-200 border-l-4 shadow-2xs transition-all ${cardBorder}`}
              >
                <strong className="block text-slate-800 text-sm truncate">
                  {isEvent ? evento!.titulo : espacio!.nombre}
                </strong>

                {isEvent && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      evento!.estado === 'aprobado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      evento!.estado === 'realizado' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      evento!.estado === 'solicitado' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      evento!.estado === 'cancelado' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {evento!.estado === 'solicitado' ? 'En Revisión' : evento!.estado.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-500">{evento!.fecha}</span>
                  </div>
                )}

                {!isEvent && (
                  <p className="m-0 text-xs text-slate-500 mt-1">
                    Capacidad: <strong className="text-slate-700">{espacio!.capacidad} personas</strong>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ======================= MODAL: REVISAR EVENTO (Izquierda) ======================= */}
      {leftSelectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4" onClick={() => setLeftSelectedEvent(null)}>
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{leftSelectedEvent.titulo}</h3>
            <p className="text-xs text-slate-400 mb-4">Evaluación de solicitud de evento</p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 mb-5 space-y-2 text-xs text-slate-600">
              <p><strong className="text-slate-800">Responsable:</strong> {leftSelectedEvent.responsable}</p>
              <p><strong className="text-slate-800">Espacio:</strong> {getSpaceDetails(leftSelectedEvent.espacioId)?.nombre}</p>
              <p><strong className="text-slate-800">Fecha:</strong> {leftSelectedEvent.fecha}</p>
              <p><strong className="text-slate-800">Asistencia esperada:</strong> {leftSelectedEvent.asistentes} personas</p>
              <p><strong className="text-slate-800">Horario:</strong> {leftSelectedEvent.horaInicio} - {leftSelectedEvent.horaFin}</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleApprove(leftSelectedEvent)} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                ✓ Aprobar
              </button>
              <button 
                onClick={() => handleReject(leftSelectedEvent)} 
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                ✕ Rechazar
              </button>
              <button 
                onClick={() => setLeftSelectedEvent(null)} 
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: GESTIÓN Y DETALLES (Derecha) ======================= */}
      {rightSelectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4" onClick={() => setRightSelectedItem(null)}>
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100" onClick={e => e.stopPropagation()}>
            
            <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              {rightTab === 'events' ? (isEditing ? '✏️ Editar Evento' : '📅 Detalle del Evento') : '🏢 Detalle del Espacio'}
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 mb-5 text-xs text-slate-600">
              {rightTab === 'events' ? (
                isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Espacio Asignado</label>
                      <select 
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs focus:outline-none focus:border-cyan-500"
                        value={editEspacioId}
                        onChange={e => setEditEspacioId(e.target.value)}
                      >
                        {spaces.map(sp => (
                          <option key={sp.id} value={sp.id}>{sp.nombre} (Cap: {sp.capacidad})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Fecha</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs focus:outline-none focus:border-cyan-500"
                        value={editFecha}
                        onChange={e => setEditFecha(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Asistencia Esperada</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs focus:outline-none focus:border-cyan-500"
                        value={editAsistentes}
                        onChange={e => setEditAsistentes(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">Hora Inicio</label>
                        <input 
                          type="time" 
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs focus:outline-none focus:border-cyan-500"
                          value={editHoraInicio}
                          onChange={e => setEditHoraInicio(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">Hora Fin</label>
                        <input 
                          type="time" 
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs focus:outline-none focus:border-cyan-500"
                          value={editHoraFin}
                          onChange={e => setEditHoraFin(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(() => {
                      const ev = rightSelectedItem as Event;
                      const sp = getSpaceDetails(ev.espacioId);
                      return (
                        <>
                          <p><strong className="text-slate-800">Título:</strong> {ev.titulo}</p>
                          <p><strong className="text-slate-800">Responsable:</strong> {ev.responsable}</p>
                          <p><strong className="text-slate-800">Espacio Asignado:</strong> {sp?.nombre || 'Desconocido'}</p>
                          <p><strong className="text-slate-800">Fecha:</strong> {ev.fecha}</p>
                          <p><strong className="text-slate-800">Asistencia esperada:</strong> {ev.asistentes}</p>
                          <p><strong className="text-slate-800">Horario:</strong> {ev.horaInicio} - {ev.horaFin}</p>
                          <p className="flex items-center gap-2">
                            <strong className="text-slate-800">Estado:</strong> 
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              ev.estado === 'aprobado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              ev.estado === 'realizado' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              ev.estado === 'solicitado' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              ev.estado === 'cancelado' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                              'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {ev.estado.toUpperCase()}
                            </span>
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  {(() => {
                    const sp = rightSelectedItem as Spaces;
                    const totalEventos = events.filter(e => e.espacioId === sp.id).length;
                    return (
                      <>
                        <p><strong className="text-slate-800">Nombre:</strong> {sp.nombre}</p>
                        <p><strong className="text-slate-800">Tipo:</strong> <span className="capitalize">{sp.tipo}</span></p>
                        <p><strong className="text-slate-800">Capacidad:</strong> {sp.capacidad} personas</p>
                        <p><strong className="text-slate-800">Eventos Asociados:</strong> {totalEventos}</p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col gap-2">
              {rightTab === 'events' && (
                <>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSaveEdit(rightSelectedItem as Event)} 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        💾 Guardar
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)} 
                        className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        ✏️ Editar Información
                      </button>

                      {(rightSelectedItem as Event).estado !== 'rechazado' && (
                        <button 
                          onClick={() => handleCancelEvent(rightSelectedItem as Event)} 
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                          🚫 Cancelar Evento
                        </button>
                      )}
                    </>
                  )}
                </>
              )}

              {!isEditing && (
                <>
                  <button 
                    onClick={() => handleDeleteRightItem(rightSelectedItem)} 
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    🗑️ Borrar Permanente
                  </button>
                  <button 
                    onClick={() => setRightSelectedItem(null)} 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer mt-1"
                  >
                    Cerrar
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ======================= MODAL DE ALERTA Global ======================= */}
      {modalMessage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-[60] p-4" onClick={() => setModalMessage(null)}>
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl border-t-4 border-t-rose-500 text-center" onClick={e => e.stopPropagation()}>
            <h3 className={`text-base font-bold mb-2 ${modalMessage.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {modalMessage.type === 'error' ? '⚠️ Acción Denegada' : '✅ Éxito'}
            </h3>
            <p className="text-xs text-slate-600">{modalMessage.text}</p>
            <button 
              onClick={() => setModalMessage(null)} 
              className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}