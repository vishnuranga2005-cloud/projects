import { useApp } from '../contexts/AppContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function RoleSelection() {
  const { setUserRole } = useApp()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {t('roleSelection.welcome') || 'Welcome to MediFlow Hospital'}
          </h1>
          <p className="text-lg text-gray-600">
            {t('roleSelection.subtitle') || 'Select your portal to continue'}
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Patient Portal */}
          <button
            onClick={() => setUserRole('patient')}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-500 text-left"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
              {t('roleSelection.patientPortal') || 'Patient Portal'}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('roleSelection.patientDescription') ||
                'Book appointments, view waiting times, and receive real-time updates about your appointments.'}
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {t('roleSelection.bookAppointments') || 'Book Appointments'}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {t('roleSelection.viewWaitingTime') || 'View Average Waiting Time'}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {t('roleSelection.emergencyAlerts') || 'Emergency Delay Notifications'}
              </li>
            </ul>
            <div className="mt-6 flex items-center text-teal-600 font-semibold">
              {t('roleSelection.enterPortal') || 'Enter Patient Portal'}
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </div>
          </button>

          {/* Hospital Portal */}
          <button
            onClick={() => setUserRole('hospital')}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-500 text-left"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 7h-2v2h2v2h-3v-2h-2v-2h2V8h3v2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-cyan-600 transition-colors">
              {t('roleSelection.hospitalPortal') || 'Hospital Staff Portal'}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('roleSelection.hospitalDescription') ||
                'Manage daily appointments, handle emergency cases, and update patient notifications.'}
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {t('roleSelection.manageAppointments') || 'Manage Appointments'}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {t('roleSelection.emergencyManagement') || 'Emergency Case Management'}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {t('roleSelection.patientNotifications') || 'Send Patient Notifications'}
              </li>
            </ul>
            <div className="mt-6 flex items-center text-cyan-600 font-semibold">
              {t('roleSelection.enterHospitalPortal') || 'Enter Hospital Portal'}
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-12">
          {t('roleSelection.footer') || '© 2026 MediFlow Hospital. All rights reserved.'}
        </p>
      </div>
    </div>
  )
}
