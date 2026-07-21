import { useEventStore } from '../stores/useEventStore';
import { useSpaceStore } from '../stores/useSpaceStore';

export default function Dashboard() {
  // Consumiendo directamente los stores globales de Zustand
  const events = useEventStore((state) => state.events);
  const spaces = useSpaceStore((state) => state.spaces);
  
  // LÓGICA DE NEGOCIO: Calculamos las métricas dinámicamente
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
    <div className="flex gap-5 h-full w-full">
      
      {/* PANEL IZQUIERDO: Estadísticas Globales */}
      <aside className="w-[260px] bg-[#2b3238] text-white p-[15px] rounded-lg flex flex-col gap-2.5 shrink-0 box-border">
        
        <div className="bg-transparent border border-[#454d55] flex flex-col items-start gap-2.5 p-[15px] rounded-[6px] text-[1.1rem]">
          <h3 className="m-0 text-[1rem] text-[#a9b2b9] font-medium">Eventos Totales:</h3>
          <p className="m-0 text-[2.5rem] font-bold text-white leading-none">{totalEvents}</p>
        </div>

        <div className="p-[15px] rounded-[6px] flex justify-between items-center text-[1.1rem] bg-[#2b5773]">
          <span>Solicitados:</span>
          <strong>{solicitados}</strong>
        </div>

        <div className="p-[15px] rounded-[6px] flex justify-between items-center text-[1.1rem] bg-[#3b6b4f]">
          <span>Aprobados:</span>
          <strong>{aprobados}</strong>
        </div>

        <div className="p-[15px] rounded-[6px] flex justify-between items-center text-[1.1rem] bg-[#6a3a41]">
          <span>Cancelados:</span>
          <strong>{cancelados}</strong>
        </div>

        {/* Gráfico TOTALMENTE REAL y Dinámico */}
        <div className="mt-2.5 bg-transparent border border-[#454d55] p-[15px] rounded-[6px]">
          <h4 className="m-0 mb-1 text-[1rem] font-medium">Uso de Espacios</h4>
          <p className="m-0 mb-[15px] text-[0.8rem] text-[#a9b2b9]">(Conteo real por aula)</p>
          <div className="flex items-end justify-around h-[120px] border-b border-l border-[#454d55] p-2.5 pb-0 px-1.25">
            {spaces.map(space => {
              // Contamos cuántos eventos tiene asignados ESTE espacio específico
              const conteoEventos = events.filter(e => e.espacioId === space.id).length;
              
              // Calculamos un porcentaje visual (ej. max 5 eventos para el 100% de la barra)
              const porcentajeAltura = Math.min((conteoEventos / 5) * 100, 100);

              return (
                <div 
                  key={space.id} 
                  className="w-[30px] bg-[#38a3a5] rounded-t-[2px]" 
                  style={{ height: `${porcentajeAltura || 5}%` }}
                  title={`${space.nombre}: ${conteoEventos} eventos`}
                />
              );
            })}
          </div>
        </div>

      </aside>

      {/* PANEL DERECHO: Tabla de Detalles */}
      <section className="flex-1 bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
        <div className="overflow-y-auto max-h-[600px]">
          <table className="w-full border-collapse text-left">
            
            <thead>
              <tr>
                <th className="bg-white font-bold text-[#24292e] sticky top-0 z-10 border-b-2 border-[#e1e4e8] py-3.5 px-4 text-[0.95rem]">Evento</th>
                <th className="bg-white font-bold text-[#24292e] sticky top-0 z-10 border-b-2 border-[#e1e4e8] py-3.5 px-4 text-[0.95rem]">Tipo</th>
                <th className="bg-white font-bold text-[#24292e] sticky top-0 z-10 border-b-2 border-[#e1e4e8] py-3.5 px-4 text-[0.95rem]">Responsable</th>
                <th className="bg-white font-bold text-[#24292e] sticky top-0 z-10 border-b-2 border-[#e1e4e8] py-3.5 px-4 text-[0.95rem]">Espacio</th>
                <th className="bg-white font-bold text-[#24292e] sticky top-0 z-10 border-b-2 border-[#e1e4e8] py-3.5 px-4 text-[0.95rem]">Fecha/Hora</th>
                <th className="bg-white font-bold text-[#24292e] sticky top-0 z-10 border-b-2 border-[#e1e4e8] py-3.5 px-4 text-[0.95rem]">Estado</th>
              </tr>
            </thead>
            
            <tbody>
              {events.map((evento) => (
                <tr key={evento.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3.5 px-4 border-b border-[#e1e4e8] text-[0.95rem]">{evento.titulo}</td>
                  <td className="py-3.5 px-4 border-b border-[#e1e4e8] text-[0.95rem]">Actividad</td>
                  <td className="py-3.5 px-4 border-b border-[#e1e4e8] text-[0.95rem]">{evento.responsable}</td>
                  <td className="py-3.5 px-4 border-b border-[#e1e4e8] text-[0.95rem]">{getSpaceName(evento.espacioId)}</td>
                  <td className="py-3.5 px-4 border-b border-[#e1e4e8] text-[0.95rem]">{`${evento.fecha}, ${evento.horaInicio}-${evento.horaFin}`}</td>
                  <td className="py-3.5 px-4 border-b border-[#e1e4e8] text-[0.95rem]">
                    <span className={`px-3 py-1 rounded-[20px] text-[0.85rem] font-medium inline-block ${
                      evento.estado === 'aprobado' ? 'bg-[#d4edda] text-[#155724] border border-[#c3e6cb]' :
                      evento.estado === 'solicitado' ? 'bg-[#fff3cd] text-[#856404] border border-[#ffeeba]' :
                      'bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]'
                    }`}>
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