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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-5 text-slate-900">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-10 shadow-xl ring-1 ring-slate-200">
          <h1 className="mb-5 text-2xl font-semibold text-red-600">
            Application Error
          </h1>
          <p className="mb-5 text-slate-600">
            Something went wrong. This is usually due to missing environment variables or a downstream service issue.
          </p>

          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="mt-0 font-semibold text-red-900">Error Details:</h3>
            <pre className="overflow-auto rounded-md bg-amber-50 p-3 text-sm text-slate-800 whitespace-pre-wrap">
              {errorState.error?.message || 'Unknown error'}
            </pre>
          </div>

          <h3 className="mt-8 font-semibold text-slate-800">Setup Required:</h3>
          <ol className="space-y-1 text-slate-600">
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
            className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-base font-medium text-white transition hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
