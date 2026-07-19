import { useState } from 'react'
import './App.css'

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
    <div className="app-container">
      {/* Barra superior institucional usando semántica nativa */}
      <header className="main-header">
        <div className="logo-container">
          <h1 className="header-title">FaCyT Event Manager</h1>
          <span className="ia-badge">IA ASISTIDO</span>
        </div>
        <div className="profile-icon">👤</div>
      </header>

      {/* Contenedor del cuerpo principal (Sidebar + Contenido) */}
      <div className="main-layout">

      {/* BARRA LATERAL (SIDEBAR) */}
      <nav className="sidebar">
          <button 
            className={`sidebar-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>

          <button 
            className={`sidebar-btn ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            📅 Calendario
          </button>

          <button 
            className={`sidebar-btn ${currentView === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentView('reports')}
          >
            📋 Reportes
          </button>

          <button 
            className={`sidebar-btn ${currentView === 'submit' ? 'active' : ''}`}
            onClick={() => setCurrentView('submit')}
          >
            ✍️ Registrar
          </button>

          <button 
            className={`sidebar-btn ${currentView === 'review' ? 'active' : ''}`}
            onClick={() => setCurrentView('review')}
          >
            ⚙️ Revisar
          </button>

          
        </nav>


      {/* ESPACIO CENTRAL VIVO */}
      <main className="content-area">
          {renderView()}
        </main>

      </div>
    </div>
  )
}

export default App