import { useState, useMemo } from 'react';
import { useEventsQuery, useSpacesQuery, useAddReview } from '../hooks/useScheduleQueries';
import { useAuthStore } from '../stores/useAuthStore';
import type { Event } from '../data/events';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
}

type EventWithReviews = Event & {
  reviews?: Review[];
  calificaciones?: any[];
  calificacionPromedio?: number;
  promedioCalificacion?: number;
};

export default function Reports() {
  const { data: events = [], isLoading: loadingEvents } = useEventsQuery();
  const { data: spaces = [], isLoading: loadingSpaces } = useSpacesQuery();
  const addReview = useAddReview();
  const user = useAuthStore((s) => s.user);

  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');

  const realizedEvents = useMemo(() => {
    return (events as EventWithReviews[])
      .filter(e => e.estado === 'realizado')
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [events]);

  const spaceStats = useMemo(() => {
    const usageMap: Record<string, number> = {};
    const ratingsMap: Record<string, number[]> = {};

    realizedEvents.forEach(ev => {
      // 1. Contar uso del espacio
      usageMap[ev.espacioId] = (usageMap[ev.espacioId] || 0) + 1;

      // 2. Extraer o calcular la calificación promedio del evento
      const reviews = ev.reviews && ev.reviews.length > 0 
        ? ev.reviews 
        : (ev.calificaciones || []).map((c: any) => ({
            rating: c.calificacion || c.rating || 0
          }));

      let eventRating = 0;
      if (reviews.length > 0) {
        eventRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length;
      } else if (ev.calificacionPromedio || ev.promedioCalificacion) {
        eventRating = ev.calificacionPromedio || ev.promedioCalificacion || 0;
      }

      // 3. Si el evento tiene calificación, se acumula para el espacio correspondiente
      if (eventRating > 0) {
        if (!ratingsMap[ev.espacioId]) {
          ratingsMap[ev.espacioId] = [];
        }
        ratingsMap[ev.espacioId].push(eventRating);
      }
    });

    // 4. Mapear cada espacio con su contador de uso y su promedio real acumulado
    const spacesWithUsage = spaces.map(sp => {
      const spaceRatings = ratingsMap[sp.id] || [];
      const avgRating = spaceRatings.length > 0
        ? spaceRatings.reduce((a, b) => a + b, 0) / spaceRatings.length
        : 0;

      return {
        ...sp,
        usageCount: usageMap[sp.id] || 0,
        rating: avgRating,
      };
    });

    const sortedByUsage = [...spacesWithUsage].sort((a, b) => b.usageCount - a.usageCount);
    const sortedByRating = [...spacesWithUsage].sort((a, b) => b.rating - a.rating);

    return {
      mostUsed: sortedByUsage[0],
      bestRated: sortedByRating[0],
      spacesByUsage: sortedByUsage,
      spacesByRating: sortedByRating,
    };
  }, [realizedEvents, spaces]);

  const renderStars = (rating: number = 0, isUnrated: boolean = false) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span 
        key={index} 
        className={!isUnrated && index < Math.round(rating) ? "text-yellow-400" : "text-slate-300"}
      >
        ★
      </span>
    ));
  };

  const handleToggleEvent = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
    setExpandedReviewId(null);
  };

  const handleToggleReview = (reviewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedReviewId(expandedReviewId === reviewId ? null : reviewId);
  };

  const handleAddReview = async (eventId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addReview.mutateAsync({
        eventId,
        rating: newRating,
        comment: newComment,
      });
      setNewComment('');
      setNewRating(5);
      setHoverRating(0);
    } catch (err) {
      console.error('Error al publicar comentario:', err);
    }
  };

  if (loadingEvents || loadingSpaces) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        Cargando reportes e historial de eventos…
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 max-w-5xl mx-auto space-y-8">
      
      {/* ENCABEZADO */}
      <div>
        <h2 className="m-0 mb-1 text-slate-800 text-2xl font-bold flex items-center gap-2">
          📋 Reportes e Historial de Eventos
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed m-0">
          Métricas generales de espacios e historial de eventos realizados.
        </p>
      </div>

      {/* SECCIÓN DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Espacio más usado</h3>
          <p className="text-lg font-bold text-slate-800 mt-1">
            {spaceStats.mostUsed ? spaceStats.mostUsed.nombre : 'Sin datos'}
          </p>
          <p className="text-xs font-medium text-cyan-700 mt-0.5">
            {spaceStats.mostUsed?.usageCount || 0} eventos realizados
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mejor promedio de calificación</h3>
          <p className="text-lg font-bold text-slate-800 mt-1">
            {spaceStats.bestRated ? spaceStats.bestRated.nombre : 'Sin datos'}
          </p>
          <div className="text-xs font-medium text-cyan-700 flex items-center gap-1 mt-0.5">
            {spaceStats.bestRated?.rating ? (
              <>
                <span>{spaceStats.bestRated.rating.toFixed(1)}</span>
                <span className="flex items-center gap-0.5">
                  {renderStars(spaceStats.bestRated.rating)}
                </span>
              </>
            ) : (
              'Sin calificaciones'
            )}
          </div>
        </div>
      </div>

      {/* DESPLEGABLES DE ESPACIOS */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">Ranking: Más Usados</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-cyan-500">
            {spaceStats.spacesByUsage.map(sp => (
              <option key={`use-${sp.id}`} value={sp.id}>
                {sp.nombre} ({sp.usageCount} eventos)
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">Ranking: Mejor Calificados</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-cyan-500">
            {spaceStats.spacesByRating.map(sp => (
              <option key={`rate-${sp.id}`} value={sp.id}>
                {sp.nombre} ({sp.rating > 0 ? `${sp.rating.toFixed(1)} ★` : 'Sin calificar'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTA DE EVENTOS REALIZADOS */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
          Eventos Realizados ({realizedEvents.length})
        </h3>

        {realizedEvents.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No hay eventos marcados como realizados todavía.
          </div>
        ) : (
          <div className="space-y-3">
            {realizedEvents.map(evento => {
              const espacio = spaces.find(s => s.id === evento.espacioId);
              const isExpanded = expandedEventId === evento.id;
              
              const reviews: Review[] = evento.reviews && evento.reviews.length > 0 
                ? evento.reviews 
                : (evento.calificaciones || []).map((c: any, i: number) => ({
                    id: String(i),
                    userName: c.nombreUsuario || c.userName || 'Usuario',
                    rating: c.calificacion || c.rating || 5,
                    comment: c.comentario || c.comment || '',
                  }));
              
              const hasReviews = reviews.length > 0;
              const calificacion = hasReviews
                ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                : (evento.calificacionPromedio || evento.promedioCalificacion || 0);

              const isUnrated = !hasReviews && !evento.calificacionPromedio && !evento.promedioCalificacion;
              const aforoLleno = espacio ? reviews.length >= espacio.capacidad : false;

              // Comparar con el nombre del usuario actual que sale en el encabezado
              const currentUserName = user?.name?.trim().toLowerCase();
              const userHasCommented = Boolean(currentUserName) && reviews.some(
                r => r.userName.trim().toLowerCase() === currentUserName
              );

              return (
                <div 
                  key={evento.id} 
                  className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xs"
                >
                  {/* Cabecera del Evento */}
                  <div 
                    className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50"
                    onClick={() => handleToggleEvent(evento.id)}
                  >
                    <div className="flex-1">
                      <h4 className="text-slate-800 font-bold text-base m-0">{evento.titulo}</h4>
                      <p className="text-xs text-slate-500 mt-1 m-0">
                        📍 {espacio?.nombre || 'Espacio Desconocido'} &nbsp;•&nbsp; 📅 {evento.fecha} ({evento.horaInicio} - {evento.horaFin})
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 m-0">
                        Responsable: {evento.responsable} &nbsp;|&nbsp; Aforo Máximo: {espacio?.capacidad || 0}
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="text-sm">{renderStars(calificacion, isUnrated)}</div>
                      {isUnrated ? (
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full mt-1 border border-slate-200">
                          Sin calificar
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full mt-1">
                          {calificacion.toFixed(1)} / 5.0
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Detalle Desplegable */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs">
                      <h5 className="font-bold text-slate-700 mb-3 uppercase tracking-wider">
                        Calificaciones y Comentarios ({reviews.length})
                      </h5>
                      
                      {reviews.length > 0 ? (
                        <ul className="space-y-2 mb-5">
                          {reviews.map(review => (
                            <li key={review.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                              <div 
                                className="p-2.5 cursor-pointer hover:bg-slate-50 flex justify-between items-center"
                                onClick={(e) => handleToggleReview(review.id, e)}
                              >
                                <span className="font-semibold text-slate-700">{review.userName}</span>
                                <span>{renderStars(review.rating)}</span>
                              </div>
                              
                              {expandedReviewId === review.id && (
                                <div className="p-3 bg-slate-100/70 text-slate-600 border-t border-slate-200 italic">
                                  "{review.comment}"
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-400 mb-5 italic">Aún no hay opiniones registradas para este evento.</p>
                      )}

                      {/* Formulario de Calificación */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                        {userHasCommented ? (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-medium text-center">
                          ✅ Ya has publicado una calificación para este evento.
                          </div>
                        ) : aforoLleno ? (
                          <p className="text-rose-500 font-medium">
                            Se ha alcanzado el límite de comentarios permitidos según la capacidad del espacio ({espacio?.capacidad} personas).
                          </p>
                        ) : (
                          <form onSubmit={(e) => handleAddReview(evento.id, e)} className="flex flex-col gap-3">
                          <h6 className="font-bold text-slate-800 mb-2">Agregar Calificación</h6>
                            <div className="flex items-center gap-2">
                              <label className="text-slate-600 font-medium">Puntuación:</label>
                              <div
                                className="flex items-center gap-0.5 text-xl leading-none"
                                onMouseLeave={() => setHoverRating(0)}
                              >
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const active = star <= (hoverRating || newRating);
                                  return (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setNewRating(star)}
                                      onMouseEnter={() => setHoverRating(star)}
                                      aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                                      className={`transition-colors cursor-pointer ${
                                        active ? 'text-yellow-400' : 'text-slate-300'
                                      }`}
                                    >
                                      ★
                                    </button>
                                  );
                                })}
                              </div>
                              <span className="text-slate-500 font-medium">
                                {newRating}/5
                              </span>
                            </div>
                            <textarea
                              required
                              placeholder="Escribe tu opinión sobre el evento..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-cyan-500"
                              rows={2}
                            />
                            <button 
                              type="submit" 
                              disabled={addReview.isPending}
                              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg self-end transition-colors cursor-pointer"
                            >
                              {addReview.isPending ? 'Enviando…' : 'Publicar Opinión'}
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}