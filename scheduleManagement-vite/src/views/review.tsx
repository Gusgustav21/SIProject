export default function Review() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e1e4e8]">
      <h2 className="m-0 mb-3 text-[#008b8b] text-xl font-bold">🔍 Revisión y Gestión de Solicitudes</h2>
      <p className="text-[#586069] leading-relaxed m-0 mb-4">
        Panel administrativo diseñado para evaluar las actividades propuestas. Permite cambiar los estados del flujo (Aprobar / Rechazar / Cancelar) y gestionar los parámetros simulados de las aulas o laboratorios disponibles.
      </p>
      <div className="bg-[#fff5df] border-l-4 border-[#e2b026] p-3 rounded-r-md text-[#24292e] text-[0.9rem]">
        <strong>⚙️ Simulación de Roles:</strong> Esta interfaz actuará bajo la lógica del Coordinador de Espacios o Decanato para tomar decisiones sobre la agenda institucional.
      </div>
    </div>
  )
}