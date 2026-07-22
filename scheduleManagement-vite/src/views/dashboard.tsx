import { useEventStore } from '../stores/useEventStore';
import { useSpaceStore } from '../stores/useSpaceStore';

export default function Dashboard() {
  const events = useEventStore((state) => state.events);
  const spaces = useSpaceStore((state) => state.spaces);
  
  // LÓGICA DE NEGOCIO: Métricas dinámicas incluyendo 'realizado'
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full">
      
      {/* ======================= PANEL IZQUIERDO ======================= */}
      <aside className="w-full lg:w-[280px] bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-lg flex flex-col gap-4 shrink-0 overflow-y-auto">
        
        {/* Total Metric */}
        <div className="bg-slate-800/50 border border-slate-700 flex flex-col items-start gap-1 p-5 rounded-xl">
          <h2 className="m-0 text-sm text-slate-400 font-medium uppercase tracking-wider">Eventos Totales</h2>
          <p className="m-0 text-4xl font-black text-white">{totalEvents}</p>
        </div>

        {/* Status Metrics */}
        <div className="flex flex-col gap-2">
          <div className="px-4 py-3 rounded-lg flex justify-between items-center bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <span className="font-medium">En Revisión</span>
            <strong className="text-xl">{solicitados}</strong>
          </div>

          <div className="px-4 py-3 rounded-lg flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="font-medium">Aprobados</span>
            <strong className="text-xl">{aprobados}</strong>
          </div>

          <div className="px-4 py-3 rounded-lg flex justify-between items-center bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <span className="font-medium">Realizados</span>
            <strong className="text-xl">{realizados}</strong>
          </div>

          <div className="px-4 py-3 rounded-lg flex justify-between items-center bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span className="font-medium">Rechazados</span>
            <strong className="text-xl">{rechazados}</strong>
          </div>

          <div className="px-4 py-3 rounded-lg flex justify-between items-center bg-slate-500/10 border border-slate-500/20 text-slate-400">
            <span className="font-medium">Cancelados</span>
            <strong className="text-xl">{cancelados}</strong>
          </div>
        </div>

        {/* Gráfico de Uso de Espacios */}
        <div className="mt-auto bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
          <h4 className="m-0 mb-1 text-sm font-semibold text-slate-200">Uso de Espacios</h4>
          <p className="m-0 mb-4 text-xs text-slate-400">(Conteo por aula)</p>
          <div className="flex items-end justify-between h-[100px] border-b border-l border-slate-600 p-2 pb-0">
            {spaces.slice(0, 8).map(space => {
              const conteoEventos = events.filter(e => e.espacioId === space.id).length;
              const porcentajeAltura = Math.min((conteoEventos / 10) * 100, 100);

              return (
                <div 
                  key={space.id} 
                  className="w-4 bg-cyan-500 hover:bg-cyan-400 transition-colors rounded-t-sm cursor-help relative group" 
                  style={{ height: `${porcentajeAltura || 2}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity z-20 shadow-lg">
                    {space.nombre}: {conteoEventos}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ======================= PANEL DERECHO ======================= */}
      <section className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
          <table className="w-full border-collapse text-left text-sm">
            
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="font-semibold text-slate-600 py-4 px-5 border-b border-slate-200 uppercase tracking-wider text-xs">Evento</th>
                <th className="font-semibold text-slate-600 py-4 px-5 border-b border-slate-200 uppercase tracking-wider text-xs">Aforo</th>
                <th className="font-semibold text-slate-600 py-4 px-5 border-b border-slate-200 uppercase tracking-wider text-xs">Responsable</th>
                <th className="font-semibold text-slate-600 py-4 px-5 border-b border-slate-200 uppercase tracking-wider text-xs">Espacio</th>
                <th className="font-semibold text-slate-600 py-4 px-5 border-b border-slate-200 uppercase tracking-wider text-xs">Fecha/Hora</th>
                <th className="font-semibold text-slate-600 py-4 px-5 border-b border-slate-200 uppercase tracking-wider text-xs text-center">Estado</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {events.map((evento) => (
                <tr key={evento.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-5 text-slate-800 font-medium">{evento.titulo}</td>
                  <td className="py-4 px-5 text-slate-500">{evento.asistentes}</td>
                  <td className="py-4 px-5 text-slate-600">{evento.responsable}</td>
                  <td className="py-4 px-5 text-slate-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600">
                      {getSpaceName(evento.espacioId)}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-500 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{evento.fecha}</span>
                      <span className="text-xs">{evento.horaInicio} - {evento.horaFin}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-block border ${
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