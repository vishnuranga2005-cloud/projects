'use client'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: '600px',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '40px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '3rem', color: '#1f2937', margin: '0 0 20px 0' }}>
          404
        </h1>
        <h2 style={{ color: '#6b7280', marginBottom: '20px' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '30px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Go Back Home
        </a>
      </div>
    </div>
  )
}
