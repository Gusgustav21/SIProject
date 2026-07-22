import { useState, useMemo } from 'react';
import { useEventStore } from '../stores/useEventStore';
import { useSpaceStore } from '../stores/useSpaceStore';
import type { Event } from '../data/events';

export default function Calendar() {
  const { events } = useEventStore();
  const { spaces } = useSpaceStore();

  // Estado para controlar el mes y año actual del calendario
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Calcular número total de semanas para adaptar el grid
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
    <div className="flex flex-col lg:flex-row gap-6 h-full max-h-[calc(100vh-120px)] overflow-hidden">
      
      {/* ======================= COLUMNA IZQUIERDA: AGENDA ======================= */}
      <aside className="w-full lg:w-[320px] xl:w-[360px] bg-white p-5 rounded-2xl shadow-sm border border-[#e1e4e8] flex flex-col overflow-y-auto">
        <h2 className="m-0 mb-4 text-[#008b8b] text-xl font-bold flex items-center gap-2">
          <span>📌</span> Próximas Actividades
        </h2>

        <div className="flex flex-col gap-3 flex-1">
          {upcomingEvents.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 italic">
              <p>No hay eventos programados próximamente.</p>
            </div>
          ) : (
            upcomingEvents.map(evento => (
              <div 
                key={evento.id} 
                className="relative bg-gray-50 p-3.5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${evento.estado === 'realizado' ? 'bg-blue-400' : 'bg-green-500'}`} />
                
                <p className="text-xs font-bold text-[#008b8b] mb-1 flex justify-between items-center">
                  <span>📅 {evento.fecha.split('-').reverse().join('/')}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] text-white ${evento.estado === 'realizado' ? 'bg-blue-400' : 'bg-green-500'}`}>
                    {evento.estado.toUpperCase()}
                  </span>
                </p>
                <h4 className="m-0 text-[0.98rem] font-bold text-gray-800 leading-tight mb-1">
                  {evento.titulo}
                </h4>
                <p className="text-xs text-gray-600 mb-2 truncate">
                  📍 {getSpaceName(evento.espacioId)}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white border border-gray-100 p-1.5 rounded-lg">
                  <span>⏰ {evento.horaInicio} - {evento.horaFin}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ======================= COLUMNA DERECHA: CALENDARIO DINÁMICO ======================= */}
      <main className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-[#e1e4e8] flex flex-col overflow-y-auto">
        
        {/* Cabecera del Calendario */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="m-0 text-xl font-black text-gray-800 capitalize">
              {monthNames[month]} <span className="text-[#008b8b]">{year}</span>
            </h2>
            <button 
              onClick={goToToday} 
              className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-lg transition-colors"
            >
              Hoy
            </button>
          </div>
          
          <div className="flex gap-1.5">
            <button 
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors text-xs"
            >
              ◀
            </button>
            <button 
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors text-xs"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Cuadrícula del Calendario */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Nombres de los días */}
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes con filas distribuidas proporcionalmente */}
          <div 
            className="grid grid-cols-7 gap-1.5 flex-1"
            style={{ gridTemplateRows: `repeat(${totalWeeks}, minmax(0, 1fr))` }}
          >
            {/* Espacios en blanco previos */}
            {blanks.map(blank => (
              <div key={`blank-${blank}`} className="bg-gray-50/50 rounded-xl border border-transparent"></div>
            ))}

            {/* Días reales */}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              const todayClass = isToday(day) 
                ? 'bg-[#eef9fa] border-[#008b8b]/40 shadow-inner' 
                : 'bg-white border-gray-100 hover:border-gray-300';

              return (
                <div 
                  key={day} 
                  className={`border rounded-xl p-1.5 transition-colors flex flex-col overflow-hidden min-h-[64px] ${todayClass}`}
                >
                  <div className="flex justify-between items-start mb-0.5">
                    <span className={`text-xs font-bold ${isToday(day) ? 'text-[#008b8b]' : 'text-gray-700'}`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1 rounded-full">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  
                  {/* Píldoras de Eventos */}
                  <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div 
                        key={ev.id} 
                        title={`${ev.titulo} (${ev.horaInicio}-${ev.horaFin})`}
                        className={`text-[9px] truncate px-1 py-0.5 rounded cursor-pointer transition-opacity hover:opacity-80 leading-tight ${
                          ev.estado === 'realizado' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {ev.horaInicio} {ev.titulo}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-gray-500 font-bold px-0.5 mt-auto">
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

    </div>
  );
}