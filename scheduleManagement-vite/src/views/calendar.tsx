export default function Calendar() {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>📅 Vista de Calendario y Agenda</h2>
        <p style={styles.text}>
          Aquí se renderizará la cuadrícula mensual o semanal para consultar las actividades planificadas y los horarios reservados en los laboratorios y salones.
        </p>
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