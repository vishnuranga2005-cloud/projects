import type { Metadata } from 'next'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediFlow - Healthcare Appointment System',
  description: 'Book appointments with doctors, manage medical records, and more.',
  viewport: 'width=device-width, initial-scale=1.0',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" defer />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
