export default function Submit() {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>✍️ Registrar Nuevo Evento</h2>
        <p style={styles.text}>
          Aquí se ubicará el formulario principal para capturar los datos de las solicitudes: título de la actividad, profesor responsable, tipo de evento, selección del espacio de la FaCyT, fecha y rango de horas.
        </p>
        <div style={styles.infoBox}>
          <strong>💡 Control de negocio:</strong> En esta vista se validará en tiempo real que el salón seleccionado no tenga choques de horario con otros eventos ya aprobados.
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
      backgroundColor: '#f1f8ff',
      borderLeft: '4px solid #0366d6',
      padding: '12px',
      borderRadius: '0 6px 6px 0',
      color: '#24292e',
      fontSize: '0.9rem',
    }
  }