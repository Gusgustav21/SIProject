import { useState } from 'react'

import Dashboard from './views/dashboard'
import Calendar from './views/calendar'
import Reports from './views/reports'
import Submit from './views/submit'
import Review from './views/review'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'calendar':
        return <Calendar />
      case 'reports':
        return <Reports />
      case 'submit': 
        return <Submit />
      case 'review': 
        return <Review />
      default:
        return <Dashboard />
    }
  }

  // Configuración de los ítems de navegación para evitar repetición de código
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'reports', label: 'Reportes', icon: '📋' },
    { id: 'submit', label: 'Registrar', icon: '✍️' },
    { id: 'review', label: 'Revisar', icon: '⚙️' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans antialiased text-slate-800">
      
      {/* HEADER PRINCIPAL */}
      <header className="flex justify-between items-center bg-slate-900 border-b border-slate-800 px-6 h-16 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 p-2 rounded-xl flex items-center justify-center font-bold text-lg">
            🎓
          </div>
          <div>
            <h1 className="text-white text-lg font-bold leading-tight">FaCyT Event Manager</h1>
            <p className="text-slate-400 text-xs m-0">Universidad de Carabobo</p>
          </div>
          <span className="ml-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full uppercase">
            IA Asistido
          </span>
        </div>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-xs text-slate-200 font-medium">Coordinación FaCyT</span>
            <span className="block text-[10px] text-slate-400">admin@uc.edu.ve</span>
          </div>
          <button 
            type="button" 
            aria-label="Perfil de usuario"
            className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-600 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
          >
            👤
          </button>
        </div>
      </header>

      {/* CUERPO PRINCIPAL (Sidebar + Contenido) */}
      <div className="flex flex-1 w-full overflow-hidden">

        {/* BARRA LATERAL (SIDEBAR) */}
        <nav className="w-46 bg-slate-900 border-r border-slate-800 flex flex-col p-4 gap-1.5 shrink-0">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Menú Principal
          </div>

          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button 
                key={item.id}
                className={`w-full flex items-center gap-3 py-2.5 px-3.5 text-sm font-medium rounded-xl transition-all duration-150 cursor-pointer text-left ${
                  isActive 
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
                onClick={() => setCurrentView(item.id)}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* CONTENEDOR CENTRAL */}
        <main className="flex-1 p-6 bg-slate-100 overflow-y-auto">
          {renderView()}
        </main>

      </div>
    </div>
  )
}

export default App