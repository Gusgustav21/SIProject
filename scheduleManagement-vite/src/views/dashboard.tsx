// 1. Importamos las interfaces para que TypeScript sepa qué estructura tienen tus datos
// 1. Importamos las interfaces para que TypeScript sepa qué estructura tienen tus datos
import type { Event } from '../data/events';
import type { Spaces } from '../data/spaces';

// 2. Definimos qué cosas (props) va a recibir este componente desde App.tsx
interface DashboardProps {
  events: Event[];
  spaces: Spaces[];
}

// 3. Recibimos las variables dentro de los paréntesis del componente
export default function Dashboard({ events, spaces }: DashboardProps) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>📊 Vista de Dashboard</h2>
      <p style={styles.text}>
        Aquí se mostrará el resumen general de los eventos y espacios físicos de la FaCyT.
      </p>
      
      {/* Pequeña prueba para verificar en pantalla que los datos llegan bien */}
      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#586069' }}>
        <p>🔹 Espacios cargados: <strong>{spaces.length}</strong></p>
        <p>🔹 Eventos registrados: <strong>{events.length}</strong></p>
      </div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #e1e4e8',
  },
  title: {
    margin: '0 0 12px 0',
    color: '#008b8b',
  },
  text: {
    color: '#586069',
    lineHeight: '1.6',
    margin: 0,
  }
}