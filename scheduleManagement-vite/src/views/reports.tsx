export default function Reports() {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>📋 Vista de Reportes y Gestión</h2>
        <p style={styles.text}>
          Utilidad actualmente sin decidir.
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