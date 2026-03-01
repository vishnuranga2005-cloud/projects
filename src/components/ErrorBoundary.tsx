'use client'

import { ReactNode, useEffect, useState } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorState {
  hasError: boolean
  error: Error | null
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
  })

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      setErrorState({
        hasError: true,
        error: event.error,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      setErrorState({
        hasError: true,
        error: new Error(String(event.reason)),
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  if (errorState.hasError) {
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
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>
            ⚠️ Application Error
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Something went wrong. This is usually due to missing environment variables.
          </p>
          
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            padding: '15px',
            marginBottom: '20px',
          }}>
            <h3 style={{ marginTop: 0, color: '#991b1b' }}>Error Details:</h3>
            <pre style={{
              backgroundColor: '#fff7ed',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px',
            }}>
              {errorState.error?.message || 'Unknown error'}
            </pre>
          </div>

          <h3 style={{ color: '#1f2937', marginTop: '30px' }}>Setup Required:</h3>
          <ol style={{ color: '#4b5563' }}>
            <li>Go to <strong>Vercel Dashboard</strong></li>
            <li>Select your project</li>
            <li>Go to <strong>Settings → Environment Variables</strong></li>
            <li>Add these variables:
              <ul>
                <li><code>NEXT_PUBLIC_SUPABASE_URL</code> - Your Supabase project URL</li>
                <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Your Supabase public key</li>
                <li><code>NEXT_PUBLIC_RAZORPAY_KEY_ID</code> - Your Razorpay key (optional)</li>
              </ul>
            </li>
            <li>Redeploy your application</li>
          </ol>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
