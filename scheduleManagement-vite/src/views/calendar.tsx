import { useState, useMemo } from 'react';
import { useEventsQuery, useSpacesQuery } from '../hooks/useScheduleQueries';
import type { Event } from '../data/events';

export default function Calendar() {
  const { data: events = [], isLoading: loadingEvents } = useEventsQuery();
  const { data: spaces = [], isLoading: loadingSpaces } = useSpacesQuery();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // --- FILTROS Y DERIVACIÓN DE DATOS ---
  const validEvents = useMemo(() => {
    return events.filter(e => e.estado === 'aprobado' || e.estado === 'realizado');
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...validEvents]
      .filter(e => {
        const [year, month, day] = e.fecha.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        return eventDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.horaInicio}`).getTime();
        const dateB = new Date(`${b.fecha}T${b.horaInicio}`).getTime();
        return dateA - dateB;
      })
      .slice(0, 4);
  }, [validEvents]);

  // --- LÓGICA DEL CALENDARIO ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  if (loadingEvents || loadingSpaces) {
    return <p className="text-sm text-slate-500">Cargando calendario…</p>;
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalCells = blanks.length + days.length;
  const totalWeeks = Math.ceil(totalCells / 7);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return validEvents.filter(e => e.fecha === dateStr);
  };

  const getSpaceName = (id: string) => {
    return spaces.find(s => s.id === id)?.nombre || 'Espacio no asignado';
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-full max-h-[calc(100vh-120px)] overflow-hidden">

      {/* ======================= COLUMNA IZQUIERDA: AGENDA ======================= */}
      <aside className="w-full lg:w-75 xl:w-85 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100 shrink-0">
          <span className="text-lg">📌</span>
          <h2 className="m-0 text-slate-800 text-base font-bold">Próximas Actividades</h2>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          {upcomingEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs italic">
              No hay actividades programadas próximamente.
            </div>
          ) : (
            upcomingEvents.map(evento => (
              <div
                key={evento.id}
                onClick={() => setSelectedEvent(evento)}
                className="relative bg-slate-50/60 hover:bg-slate-100/80 p-3 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer group overflow-hidden border-l-4 border-l-cyan-500"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    📅 {evento.fecha.split('-').reverse().join('/')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                    evento.estado === 'realizado' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {evento.estado.toUpperCase()}
                  </span>
                </div>

                <h4 className="m-0 text-xs font-bold text-slate-800 leading-snug mb-1 group-hover:text-cyan-600 transition-colors">
                  {evento.titulo}
                </h4>

                <p className="text-[11px] text-slate-500 mb-1.5 truncate">
                  📍 {getSpaceName(evento.espacioId)}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium bg-white border border-slate-200/80 px-2 py-1 rounded-lg w-fit">
                  ⏰ {evento.horaInicio} - {evento.horaFin}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ======================= COLUMNA DERECHA: CALENDARIO SIN SCROLL ======================= */}
      <main className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-0 overflow-hidden">

        {/* Cabecera del Calendario */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="m-0 text-lg font-bold text-slate-800 capitalize">
              {monthNames[month]} <span className="text-cyan-600">{year}</span>
            </h2>
            <button
              onClick={goToToday}
              className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
            >
              Hoy
            </button>
          </div>

          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="px-2.5 py-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-xs font-semibold cursor-pointer"
            >
              ◀
            </button>
            <button
              onClick={nextMonth}
              className="px-2.5 py-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-xs font-semibold cursor-pointer"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Contenedor flexible de la cuadrícula */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Nombres de los días */}
          <div className="grid grid-cols-7 gap-1 mb-1 shrink-0">
            {dayNames.map(day => (
              <div key={day} className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes (Distribuídos exactamente según las semanas del mes) */}
          <div
            className="grid grid-cols-7 gap-1 flex-1 min-h-0"
            style={{ gridTemplateRows: `repeat(${totalWeeks}, minmax(0, 1fr))` }}
          >
            {/* Días previos vacíos */}
            {blanks.map(blank => (
              <div key={`blank-${blank}`} className="bg-slate-50/40 rounded-xl border border-slate-100/40"></div>
            ))}

            {/* Días del mes */}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              const todayClass = isToday(day)
                ? 'bg-cyan-50/40 border-cyan-300 shadow-2xs'
                : 'bg-white border-slate-200/80 hover:border-slate-300';

              return (
                <div
                  key={day}
                  className={`border rounded-xl p-1 transition-all flex flex-col overflow-hidden h-full min-h-0 ${todayClass}`}
                >
                  <div className="flex justify-between items-center mb-0.5 shrink-0">
                    <span className={`text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center ${
                      isToday(day) ? 'bg-cyan-600 text-white' : 'text-slate-700'
                    }`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1 rounded-full">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Píldoras de Eventos */}
                  <div className="flex flex-col gap-0.5 flex-1 min-h-0 overflow-hidden justify-start">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        title={`${ev.titulo} (${ev.horaInicio} - ${ev.horaFin})`}
                        className={`text-[9px] font-medium truncate px-1 py-0.5 rounded cursor-pointer transition-opacity hover:opacity-85 leading-none shrink-0 ${
                          ev.estado === 'realizado' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/60' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}
                      >
                        {ev.horaInicio} {ev.titulo}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-slate-400 font-bold px-0.5 mt-auto shrink-0 leading-none">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ======================= MODAL: DETALLE DEL EVENTO ======================= */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base font-bold text-slate-800 m-0">{selectedEvent.titulo}</h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${
                selectedEvent.estado === 'realizado' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {selectedEvent.estado}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">Información del evento en la agenda</p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 mb-5 space-y-2 text-xs text-slate-600">
              <p><strong className="text-slate-800">Responsable:</strong> {selectedEvent.responsable}</p>
              <p><strong className="text-slate-800">Espacio Asignado:</strong> {getSpaceName(selectedEvent.espacioId)}</p>
              <p><strong className="text-slate-800">Fecha:</strong> {selectedEvent.fecha.split('-').reverse().join('/')}</p>
              <p><strong className="text-slate-800">Horario:</strong> {selectedEvent.horaInicio} - {selectedEvent.horaFin}</p>
              {selectedEvent.asistentes && (
                <p><strong className="text-slate-800">Asistencia esperada:</strong> {selectedEvent.asistentes} personas</p>
              )}
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}