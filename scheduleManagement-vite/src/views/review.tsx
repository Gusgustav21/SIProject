export default function Review() {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>🔍 Revisión y Gestión de Solicitudes</h2>
        <p style={styles.text}>
          Panel administrativo diseñado para evaluar las actividades propuestas. Permite cambiar los estados del flujo (Aprobar / Rechazar / Cancelar) y gestionar los parámetros simulados de las aulas o laboratorios disponibles.
        </p>
        <div style={styles.infoBox}>
          <strong>⚙️ Simulación de Roles:</strong> Esta interfaz actuará bajo la lógica del Coordinador de Espacios o Decanato para tomar decisiones sobre la agenda institucional.
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
      margin: '0 0 16px 0',
    },
    infoBox: {
      backgroundColor: '#fff5df',
      borderLeft: '4px solid #e2b026',
      padding: '12px',
      borderRadius: '0 6px 6px 0',
      color: '#24292e',
      fontSize: '0.9rem',
    }
  }