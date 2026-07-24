import { useMemo } from 'react';
import { useEventsQuery, useSpacesQuery } from '../hooks/useScheduleQueries';

const statePriority: Record<string, number> = {
  solicitado: 1,
  aprobado: 2,
  realizado: 3,
  cancelado: 4,
  rechazado: 5,
};

export default function Dashboard() {
  const { data: events = [], isLoading: loadingEvents, isError: errorEvents } = useEventsQuery();
  const { data: spaces = [], isLoading: loadingSpaces } = useSpacesQuery();

  // Métricas
  const totalEvents = events.length;
  const solicitados = events.filter(e => e.estado === 'solicitado').length;
  const aprobados = events.filter(e => e.estado === 'aprobado').length;
  const realizados = events.filter(e => e.estado === 'realizado').length;
  const rechazados = events.filter(e => e.estado === 'rechazado').length;
  const cancelados = events.filter(e => e.estado === 'cancelado').length;

  const getSpaceName = (espacioId: string) => {
    const space = spaces.find(s => s.id === espacioId);
    return space ? space.nombre : 'Por asignar';
  };

  // Eventos ordenados por Estado Prioritario + Fecha próxima
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const priorityDiff = (statePriority[a.estado] || 99) - (statePriority[b.estado] || 99);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
  }, [events]);

  if (loadingEvents || loadingSpaces) {
    return <p className="text-sm text-slate-500">Cargando dashboard…</p>;
  }

  if (errorEvents) {
    return <p className="text-sm text-rose-600">No se pudieron cargar los eventos.</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-110px)] w-full overflow-hidden">
      
      {/* ======================= PANEL IZQUIERDO ======================= */}
      <aside className="w-full lg:w-65 bg-slate-900 text-slate-100 p-4 rounded-2xl shadow-lg flex flex-col gap-3 shrink-0 justify-between">
        
        {/* Total Metric */}
        <div className="bg-slate-800/50 border border-slate-700/80 flex items-center justify-between p-3.5 rounded-xl">
          <div>
            <h2 className="m-0 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Eventos Totales</h2>
            <p className="m-0 text-2xl font-black text-white">{totalEvents}</p>
          </div>
          <span className="text-2xl">📊</span>
        </div>

        {/* Status Metrics */}
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          <div className="px-3 py-2 rounded-lg flex justify-between items-center bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
            <span className="font-medium">En Revisión</span>
            <strong className="text-sm font-bold">{solicitados}</strong>
          </div>

          <div className="px-3 py-2 rounded-lg flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="font-medium">Aprobados</span>
            <strong className="text-sm font-bold">{aprobados}</strong>
          </div>

          <div className="px-3 py-2 rounded-lg flex justify-between items-center bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
            <span className="font-medium">Realizados</span>
            <strong className="text-sm font-bold">{realizados}</strong>
          </div>

          <div className="px-3 py-2 rounded-lg flex justify-between items-center bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            <span className="font-medium">Rechazados</span>
            <strong className="text-sm font-bold">{rechazados}</strong>
          </div>

          <div className="px-3 py-2 rounded-lg flex justify-between items-center bg-slate-500/10 border border-slate-500/20 text-slate-400 text-xs">
            <span className="font-medium">Cancelados</span>
            <strong className="text-sm font-bold">{cancelados}</strong>
          </div>
        </div>

        {/* Gráfico de Uso de Espacios */}
        <div className="bg-slate-800/50 border border-slate-700/80 p-3 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <h4 className="m-0 text-xs font-semibold text-slate-200">Uso de Espacios</h4>
            <span className="text-[10px] text-slate-400">(Aula)</span>
          </div>
          <div className="flex items-end justify-between h-17.5 border-b border-l border-slate-600 p-1 pb-0">
            {spaces.slice(0, 8).map(space => {
              const conteoEventos = events.filter(e => e.espacioId === space.id).length;
              const porcentajeAltura = Math.min((conteoEventos / 10) * 100, 100);

              return (
                <div 
                  key={space.id} 
                  className="w-3.5 bg-cyan-500 hover:bg-cyan-400 transition-colors rounded-t-xs cursor-help relative group" 
                  style={{ height: `${porcentajeAltura || 4}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none transition-opacity z-20 shadow-md">
                    {space.nombre}: {conteoEventos}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ======================= PANEL DERECHO ======================= */}
      <section className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="overflow-y-auto flex-1">
          <table className="w-full border-collapse text-left text-xs">
            
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="font-semibold text-slate-600 py-3 px-4 border-b border-slate-200 uppercase tracking-wider text-[11px]">Evento</th>
                <th className="font-semibold text-slate-600 py-3 px-4 border-b border-slate-200 uppercase tracking-wider text-[11px]">Aforo</th>
                <th className="font-semibold text-slate-600 py-3 px-4 border-b border-slate-200 uppercase tracking-wider text-[11px]">Responsable</th>
                <th className="font-semibold text-slate-600 py-3 px-4 border-b border-slate-200 uppercase tracking-wider text-[11px]">Espacio</th>
                <th className="font-semibold text-slate-600 py-3 px-4 border-b border-slate-200 uppercase tracking-wider text-[11px]">Fecha/Hora</th>
                <th className="font-semibold text-slate-600 py-3 px-4 border-b border-slate-200 uppercase tracking-wider text-[11px] text-center">Estado</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {sortedEvents.map((evento) => (
                <tr key={evento.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-2.5 px-4 text-slate-800 font-semibold max-w-45 ">{evento.titulo}</td>
                  <td className="py-2.5 px-4 text-slate-500 font-medium">{evento.asistentes}</td>
                  <td className="py-2.5 px-4 text-slate-600  max-w-32.5">{evento.responsable}</td>
                  <td className="py-2.5 px-4 text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600 inline-block max-w-30">
                      {getSpaceName(evento.espacioId)}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{evento.fecha}</span>
                      <span className="text-[10px] text-slate-400">{evento.horaInicio} - {evento.horaFin}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-block border ${
                      evento.estado === 'aprobado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      evento.estado === 'realizado' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      evento.estado === 'solicitado' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      evento.estado === 'cancelado' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {evento.estado === 'solicitado' ? 'En Revisión' : 
                       evento.estado === 'aprobado' ? 'Aprobado' : 
                       evento.estado === 'realizado' ? 'Realizado' :
                       evento.estado === 'cancelado' ? 'Cancelado' : 'Rechazado'}
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