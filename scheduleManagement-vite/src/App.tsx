import { useState } from 'react'

import Dashboard from './views/dashboard'
import Calendar from './views/calendar'
import Reports from './views/reports'
import Submit from './views/submit'
import Review from './views/review'

import { EVENTOS_INICIALES, type Event } from './data/events'
import { ESPACIOS_INICIALES, type Spaces } from './data/spaces'

function App() {
  // 2. Estado para saber qué vista está activa ('dashboard', 'calendar' o 'reports')
  const [currentView, setCurrentView] = useState('dashboard')

  const [events, setEvents] = useState<Event[]>(EVENTOS_INICIALES)
  const [spaces, setSpaces] = useState<Spaces[]>(ESPACIOS_INICIALES)

  // 3. Función auxiliar para renderizar la vista seleccionada dinámicamente
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard events={events} spaces={spaces} />
      case 'calendar':
        return <Calendar />
      case 'reports':
        return <Reports />
      case 'submit': 
      return <Submit events={events} setEvents={setEvents} spaces={spaces} setSpaces={setSpaces} />
      case 'review': 
        return <Review />
      default:
        return <Dashboard events={events} spaces={spaces} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra superior institucional usando semántica nativa */}
      <header className="flex justify-between items-center bg-[#008b8b] px-8 h-[60px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-[1.4rem] font-bold m-0">FaCyT Event Manager</h1>
          <span className="bg-[#b57edc] text-white text-[0.75rem] font-bold px-2.5 py-1 rounded-[12px]">IA ASISTIDO</span>
        </div>
        <div className="text-white text-[1.3rem] cursor-pointer">👤</div>
      </header>

      {/* Contenedor del cuerpo principal (Sidebar + Contenido) */}
      <div className="flex flex-1 w-full">

      {/* BARRA LATERAL (SIDEBAR) */}
      <nav className="w-[120px] bg-[#1e1e24] flex flex-col py-5 px-2.5 gap-3 border-r border-[#2d2d34]">
          <button 
            className={`w-full border-none py-3 px-4 text-left text-base rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/8 hover:text-white ${
              currentView === 'dashboard' ? 'bg-[#008b8b] text-white font-bold' : 'bg-transparent text-[#c9d1d9]'
            }`}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>

          <button 
            className={`w-full border-none py-3 px-4 text-left text-base rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/8 hover:text-white ${
              currentView === 'calendar' ? 'bg-[#008b8b] text-white font-bold' : 'bg-transparent text-[#c9d1d9]'
            }`}
            onClick={() => setCurrentView('calendar')}
          >
            📅 Calendario
          </button>

          <button 
            className={`w-full border-none py-3 px-4 text-left text-base rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/8 hover:text-white ${
              currentView === 'reports' ? 'bg-[#008b8b] text-white font-bold' : 'bg-transparent text-[#c9d1d9]'
            }`}
            onClick={() => setCurrentView('reports')}
          >
            📋 Reportes
          </button>

          <button 
            className={`w-full border-none py-3 px-4 text-left text-base rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/8 hover:text-white ${
              currentView === 'submit' ? 'bg-[#008b8b] text-white font-bold' : 'bg-transparent text-[#c9d1d9]'
            }`}
            onClick={() => setCurrentView('submit')}
          >
            ✍️ Registrar
          </button>

          <button 
            className={`w-full border-none py-3 px-4 text-left text-base rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/8 hover:text-white ${
              currentView === 'review' ? 'bg-[#008b8b] text-white font-bold' : 'bg-transparent text-[#c9d1d9]'
            }`}
            onClick={() => setCurrentView('review')}
          >
            ⚙️ Revisar
          </button>

          
        </nav>


      {/* ESPACIO CENTRAL VIVO */}
      <main className="flex-1 p-[30px] bg-[#f8f9fa] overflow-y-auto">
          {renderView()}
        </main>

      </div>
    </div>
  )
}

export default App