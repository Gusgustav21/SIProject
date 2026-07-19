export default function Dashboard() {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>📊 Vista de Dashboard</h2>
        <p style={styles.text}>
          Aquí se mostrará el resumen general de los eventos, las métricas de estado (solicitados, aprobados, cancelados) y el gráfico de uso de espacios físicos de la FaCyT.
        </p>
      </div>
    )
  }
  
  // Estilos locales temporales para que no se vea desordenado
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